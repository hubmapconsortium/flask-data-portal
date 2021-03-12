import urllib
from pathlib import Path
import re

from flask import current_app
from vitessce import (
    VitessceConfig,
    MultiImageWrapper,
    OmeTiffWrapper,
    Component as cm,
    DataType as dt,
    FileType as ft,
)

from .utils import get_matches
from .paths import CODEX_SPRM_DIR, IMAGE_PYRAMID_DIR, OFFSETS_DIR, CODEX_TILE_DIR

MOCK_URL = "https://example.com"


def return_empty_json_if_error(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception:
            return {}

    return wrapper


class ViewConf:
    def __init__(self, entity=None, nexus_token=None, is_mock=False):
        """Object for building the vitessce configuration.

        >>> vc = ViewConf(entity={ "uuid": "uuid" }, nexus_token='nexus_token', is_mock=True)

        """

        self._uuid = entity["uuid"]
        self._nexus_token = nexus_token
        self._entity = entity
        self._is_mock = is_mock
        self._files = []

    def build_vitessce_conf(self):
        "Build a Vitessce view conf and attach to conf attribute"
        pass

    def _replace_url_in_file(self, file):
        """Replace url in incoming file object
        >>> from pprint import pprint
        >>> vc = ViewConf(entity={ "uuid": "uuid" }, nexus_token='nexus_token', is_mock=True)
        >>> file = { 'data_type': 'CELLS', 'file_type': 'cells.json', 'rel_path': 'cells.json' }
        >>> pprint(vc._replace_url_in_file(file))
        {'data_type': 'CELLS',\n\
         'file_type': 'cells.json',\n\
         'url': 'https://example.com/uuid/cells.json?token=nexus_token'}
        """

        return {
            "data_type": file["data_type"],
            "file_type": file["file_type"],
            "url": self._build_assets_url(file["rel_path"]),
        }

    def _build_assets_url(self, rel_path):
        """Create a url for an asset.

        >>> vc = ViewConf(entity={ "uuid": "uuid" }, nexus_token='nexus_token', is_mock=True)
        >>> vc._build_assets_url("rel_path/to/clusters.ome.tiff")
        'https://example.com/uuid/rel_path/to/clusters.ome.tiff?token=nexus_token'

        """
        if not self._is_mock:
            assets_endpoint = current_app.config["ASSETS_ENDPOINT"]
        else:
            assets_endpoint = MOCK_URL
        base_url = urllib.parse.urljoin(assets_endpoint, f"{self._uuid}/{rel_path}")
        token_param = urllib.parse.urlencode({"token": self._nexus_token})
        return base_url + "?" + token_param


class ImagingViewConf(ViewConf):
    def _get_img_and_offset_url(self, img_path, img_dir):
        """Create a url for the offsets and img.
        >>> from pprint import pprint
        >>> vc = ImagingViewConf(entity={ "uuid": "uuid" },\
            nexus_token='nexus_token', is_mock=True)
        >>> pprint(vc._get_img_and_offset_url("rel_path/to/clusters.ome.tiff",\
            "rel_path/to"))
        ('https://example.com/uuid/rel_path/to/clusters.ome.tiff?token=nexus_token',\n\
         'https://example.com/uuid/output_offsets/clusters.offsets.json?token=nexus_token')

        """
        img_url = self._build_assets_url(img_path)
        return (
            img_url,
            str(
                re.sub(
                    r"ome\.tiff?",
                    "offsets.json",
                    re.sub(img_dir, OFFSETS_DIR, img_url),
                )
            ),
        )

    def _setup_view_config_raster(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=9, h=12)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8)
        return vc


class ImagePyramidViewConf(ImagingViewConf):
    def __init__(self, entity, nexus_token, is_mock=False):
        self.image_pyramid_regex = IMAGE_PYRAMID_DIR
        super().__init__(entity, nexus_token, is_mock)

    @return_empty_json_if_error
    def build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        found_images = get_matches(
            file_paths_found, self.image_pyramid_regex + r".*\.ome\.tiff?$",
        )
        vc = VitessceConfig(name="HuBMAP Data Portal")
        dataset = vc.add_dataset(name="Visualization Files")
        images = []
        for img_path in found_images:
            img_url, offsets_url = self._get_img_and_offset_url(
                img_path, self.image_pyramid_regex
            )
            images.append(
                OmeTiffWrapper(
                    img_url=img_url, offsets_url=offsets_url, name=Path(img_path).name
                )
            )
        dataset = dataset.add_object(MultiImageWrapper(images))
        vc = self._setup_view_config_raster(vc, dataset)
        conf = vc.to_dict()
        # Don't want to render all layers
        del conf["datasets"][0]["files"][0]["options"]["renderLayers"]
        return conf


class ScatterplotViewConf(ViewConf):
    @return_empty_json_if_error
    def build_vitessce_conf(self):
        file_paths_expected = [file["rel_path"] for file in self._files]
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        # We need to check that the files we expect actually exist.
        # This is due to the volatility of the datasets.
        if not set(file_paths_expected).issubset(set(file_paths_found)):
            message = f'Files for uuid "{self._uuid}" not found as expected.'
            if not self._is_mock:
                current_app.logger.info(message)
            raise FileNotFoundError(message)
        vc = VitessceConfig(name="HuBMAP Data Portal")
        dataset = vc.add_dataset(name="Visualization Files")
        for file in self._files:
            dataset = dataset.add_file(**(self._replace_url_in_file(file)))
        vc = self._setup_scatterplot_view_config(vc, dataset)
        return vc.to_dict()

    def _setup_scatterplot_view_config(self, vc, dataset):
        vc.add_view(dataset, cm.SCATTERPLOT, mapping="UMAP", x=0, y=0, w=9, h=12)
        vc.add_view(dataset, cm.CELL_SETS, x=9, y=0, w=3, h=12)
        return vc


class SPRMViewConf(ImagingViewConf):
    def __init__(self, entity, nexus_token, is_mock=False, **kwargs):
        # All "file" Vitessce objects that do not have wrappers.
        super().__init__(entity, nexus_token, is_mock)
        self._base_name = kwargs["base_name"]
        self._files = [
            {
                "rel_path": f"{CODEX_SPRM_DIR}/" + f"{self._base_name}.cells.json",
                "file_type": ft.CELLS_JSON,
                "data_type": dt.CELLS,
            },
            {
                "rel_path": f"{CODEX_SPRM_DIR}/" + f"{self._base_name}.cell-sets.json",
                "file_type": ft.CELL_SETS_JSON,
                "data_type": dt.CELL_SETS,
            },
            {
                "rel_path": f"{CODEX_SPRM_DIR}/" + f"{self._base_name}.clusters.json",
                "file_type": "clusters.json",
                "data_type": dt.EXPRESSION_MATRIX,
            },
        ]

    @return_empty_json_if_error
    def build_vitessce_conf(self):
        file_paths_found = [file["rel_path"] for file in self._entity["files"]]
        vc = VitessceConfig(name=self._base_name)
        dataset = vc.add_dataset(name="Cytokit + SPRM")
        img_url, offsets_url = self._get_img_and_offset_url(
            f"{CODEX_TILE_DIR}/{self._base_name}.ome.tiff", CODEX_TILE_DIR,
        )
        image_wrapper = OmeTiffWrapper(
            img_url=img_url, offsets_url=offsets_url, name=self._base_name
        )
        dataset = dataset.add_object(image_wrapper)
        # This tile has no segmentations
        if self._files[0]["rel_path"] not in file_paths_found:
            vc = self._setup_view_config_raster(vc, dataset)
        else:
            for file in self._files:
                dataset_file = self._replace_url_in_file(file)
                dataset = dataset.add_file(**(dataset_file))
            vc = self._setup_view_config_raster_cellsets_expression_segmentation(
                vc, dataset
            )
        return vc.to_dict()

    def _setup_view_config_raster_cellsets_expression_segmentation(self, vc, dataset):
        vc.add_view(dataset, cm.SPATIAL, x=3, y=0, w=7, h=8)
        vc.add_view(dataset, cm.DESCRIPTION, x=0, y=8, w=3, h=4)
        vc.add_view(dataset, cm.LAYER_CONTROLLER, x=0, y=0, w=3, h=8)
        vc.add_view(dataset, cm.CELL_SETS, x=10, y=5, w=2, h=7)
        vc.add_view(dataset, cm.GENES, x=10, y=0, w=2, h=5)
        vc.add_view(dataset, cm.HEATMAP, x=3, y=8, w=7, h=4).set_props(transpose=True)
        return vc
