import json
import glob
from pathlib import Path
import re

from .base_confs import ImagePyramidViewConf
from .assay_confs import (
    SeqFISHViewConf,
    CytokitSPRMConf,
    RNASeqConf,
    ATACSeqConf,
    IMSConf,
)

MOCK_NEXUS_TOKEN = "nexus_token"

FIXTURES_INPUT_DIR = "fixtures/input_entity"
FIXTURES_EXPECTED_OUTPUT_DIR = "fixtures/output_expected"

AssayConfClasses = {
    "codex": CytokitSPRMConf,
    "rna": RNASeqConf,
    "atac": ATACSeqConf,
    "ims": IMSConf,
    "image_pyramid": ImagePyramidViewConf,
    "seqfish": SeqFISHViewConf,
}


def test_assays():
    for entity_file in glob.glob(
        str(Path(__file__).parent / f"{FIXTURES_INPUT_DIR}/*_entity.json")
    ):
        assay = re.search(
            str(Path(__file__).parent / f"{FIXTURES_INPUT_DIR}/(.*)_entity.json"),
            entity_file,
        )[1]
        entity = json.loads(Path(entity_file).read_text())
        AssayViewConfClass = AssayConfClasses[assay]
        vc = AssayViewConfClass(
            entity=entity, nexus_token=MOCK_NEXUS_TOKEN, is_mock=True
        )
        vc.build_vitessce_conf()
        conf_expected = json.loads(
            (
                Path(__file__).parent
                / f"{FIXTURES_EXPECTED_OUTPUT_DIR}/{assay}_conf.json"
            ).read_text()
        )
        assert conf_expected == vc.conf
