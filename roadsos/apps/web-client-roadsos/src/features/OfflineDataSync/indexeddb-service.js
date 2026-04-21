/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

/**
 * Basic conflict resolution logic (timestamp checking)
 * for when network restores and local data needs to be synced.
 */
export const resolveConflict = (localItem, remoteItem) => {
  if (!remoteItem) return localItem;
  if (!localItem) return remoteItem;

  // Last-write-wins based on timestamp
  return localItem.lastUpdated > remoteItem.lastUpdated ? localItem : remoteItem;
};

export const syncData = async (localData, remoteData) => {
  const synced = [];
  const remoteMap = new Map(remoteData.map(item => [item.id, item]));

  for (const localItem of localData) {
    const remoteItem = remoteMap.get(localItem.id);
    synced.push(resolveConflict(localItem, remoteItem));
    if (remoteItem) remoteMap.delete(localItem.id);
  }

  // Add remaining remote items
  for (const remoteItem of remoteMap.values()) {
    synced.push(remoteItem);
  }

  return synced;
};
