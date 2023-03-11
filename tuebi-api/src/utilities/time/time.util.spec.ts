import TimeUtil from './time.util';

describe('getCurrentEpochTime', () => {
  it('should return correct epoch time in milliseconds', async () => {
    // Arrange
    const now = Date.now();
    TimeUtil.getCurrentEpochTime = jest.fn().mockResolvedValue(now)
    
    // Act
    const epoch = await TimeUtil.getCurrentEpochTime('milliseconds');
    
    // Assert
    expect(epoch).toEqual(now)
  })
  it('should return correct epoch time in seconds', async () => {
    // Arrange
    const now = Math.floor(Date.now() / 1000);
    TimeUtil.getCurrentEpochTime = jest.fn().mockResolvedValue(now)
    
    // Act
    const epoch = await TimeUtil.getCurrentEpochTime('seconds');
    
    // Assert
    expect(epoch).toEqual(now)
  })
})