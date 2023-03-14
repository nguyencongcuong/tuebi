import { runBatchAsync } from './batch.uti';

console.log = jest.fn()

describe('batch', () => {
  it('should run batch 10 times', async function () {
    // Arrange
    const records = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    // Act
    const callback = (record: number) => {
      console.log(record);
    }
    await runBatchAsync(records, callback);
    
    // Assert
    expect(console.log).toHaveBeenCalledTimes(10)
  });
})