import { pbSource, pbTarget } from "../config/pocketbase";

export const cleanTarget = async (collection) => {
  console.log("LOG:  ~ sync ~ collection:", collection);

  const targetRecords = await pbTarget.collection(collection).getFullList();
  // Clear target collection
  for await (const record of targetRecords) {
    await pbTarget.collection(collection).delete(record.id);
  }
};

export const copyFromSourceToTarget = async (collection) => {
  console.log("LOG:  ~ sync ~ collection:", collection);

  const sourceRecords = await pbSource.collection(collection).getFullList();
  // Copy source records to target
  for await (const record of sourceRecords) {
    await pbTarget.collection(collection).create(record);
  }
};

// you can also fetch all records at once via getFullList
// const sourceRecords = await pbSource.collection(collection).getFullList();
