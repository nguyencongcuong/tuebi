class TimeUtil {
  async getCurrentEpochTime(type: 'seconds' | 'milliseconds') {
    if (type === 'seconds') {
      return Math.floor(Date.now() / 1000);
    } else {
      return Date.now();
    }
  }
}

export default new TimeUtil();