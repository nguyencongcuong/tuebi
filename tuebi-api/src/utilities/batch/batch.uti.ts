// define the generator function that yields
// N items at a time from the provided array
export function* getBatch(records, batchsize = 5) {
  while (records.length) {
    yield records.splice(0, batchsize);
  }
}

export async function runBatchAsync(records, callback: Function) {
  for (let batch of getBatch(records)) {
    // do something with 5 items at a time
    // for example upload the data somewhere:
    await Promise.all(batch.map(record => callback(record)));
  }
}

export async function runBatchSync(records, callback: Function) {
  for (let batch of getBatch(records)) {
    // do something with 5 items at a time
    // for example upload the data somewhere:
    await batch.map(record => callback(record));
  }
}