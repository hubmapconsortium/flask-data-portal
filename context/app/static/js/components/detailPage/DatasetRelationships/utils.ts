import { Node, Edge } from '@xyflow/react';
import Dagre from '@dagrejs/dagre';
import { NodeWithoutPosition } from './types';
import { ProvData } from '../provenance/types';

export function applyLayout(nodes: NodeWithoutPosition[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } {
  if (nodes.length === 0 || !document) {
    return { nodes: nodes.map((n) => ({ ...n, position: { x: 0, y: 0 } })), edges };
  }
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR' });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 256,
      height: node.measured?.height ?? 50,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 256) / 2;
      const y = position.y - (node.measured?.height ?? 50) / 2;

      return { ...node, position: { x, y } } as Node;
    }),
    edges,
  };
}

export function generatePrefix(key: string) {
  return `hubmap:${key}`;
}

const entityPrefix = generatePrefix('entities');

export function getCurrentEntityNodeType(currentEntityIsComponent: boolean, currentEntityIsPrimary: boolean) {
  if (currentEntityIsPrimary) {
    return 'primaryDataset';
  }
  if (currentEntityIsComponent) {
    return 'componentDataset';
  }
  return 'processedDataset';
}

export function convertProvDataToNodesAndEdges(primaryDatasetUuid: string, provData?: ProvData) {
  const nodes: NodeWithoutPosition[] = [];
  const edges: Edge[] = [];
  if (provData) {
    const { entity, activity, used, wasGeneratedBy } = provData;
    // First, add the primary entity as the starting point
    const primaryDatasetUUID = `${entityPrefix}/${primaryDatasetUuid}`;
    const primaryEntity = entity[primaryDatasetUUID];
    if (!primaryEntity) {
      return { nodes, edges };
    }
    // Maintain a queue of entities to process
    const queuedEntities: string[] = [primaryDatasetUUID];
    const componentDatasets = new Set<string>();
    while (queuedEntities.length > 0) {
      const queuedActivities: string[] = [];
      const currentEntityUUID = queuedEntities.shift()!;
      const currentEntity = entity[currentEntityUUID];
      if (!currentEntity) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // Find all activities that used this entity
      const entityChildActivityEdges = Object.values(used).filter((edge) => edge['prov:entity'] === currentEntityUUID);
      entityChildActivityEdges.forEach((edge) => {
        const activityUUID = edge['prov:activity'];
        if (!queuedActivities.includes(activityUUID)) {
          queuedActivities.push(activityUUID);
        }
      });
      // Determine the type of the current entity
      const currentEntityIsComponent = componentDatasets.has(currentEntityUUID);
      const currentEntityIsPrimary = currentEntityUUID === primaryDatasetUUID;
      const currentEntityType = getCurrentEntityNodeType(currentEntityIsComponent, currentEntityIsPrimary);

      // Add current entity as a node
      nodes.push({
        id: currentEntityUUID,
        type: currentEntityType,
        data: {
          name: currentEntity[generatePrefix('hubmap_id')],
          status: currentEntity[generatePrefix('status')],
          datasetType: currentEntity[generatePrefix('dataset_type')],
        },
      });
      // Iterate over all activities that used this entity
      queuedActivities.forEach((activityUUID) => {
        const currentActivity = activity[activityUUID];
        if (!currentActivity) {
          return;
        }
        // Find all entities that were generated by this activity and add them to the queue
        const activityChildEntityEdges = Object.values(wasGeneratedBy).filter(
          (edge) => edge['prov:activity'] === activityUUID,
        );
        activityChildEntityEdges.forEach((edge) => {
          const entityUUID = edge['prov:entity'];
          if (currentActivity[generatePrefix('creation_action')] === 'Multi-Assay Split') {
            componentDatasets.add(entityUUID);
          }
          if (!queuedEntities.includes(entityUUID)) {
            edges.push({
              id: `${activityUUID}-${entityUUID}`,
              source: activityUUID,
              target: entityUUID,
            });
            queuedEntities.push(entityUUID);
          }
        });
        // Add current activity as a node
        nodes.push({
          id: activityUUID,
          type: 'pipeline',
          data: {
            name: currentActivity[generatePrefix('creation_action')],
            status: currentActivity[generatePrefix('status')],
            childDatasets: activityChildEntityEdges.map((edge) => edge['prov:entity'].split('/')[1]),
            singleAssay: activityChildEntityEdges.length === 1,
          },
        });
        // Add edges between the current entity and the current activity
        edges.push({
          id: `${currentEntityUUID}-${activityUUID}`,
          source: currentEntityUUID,
          target: activityUUID,
          type: 'default',
        });
      });
    }
  }
  return { nodes, edges };
}
