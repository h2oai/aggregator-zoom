export function poll(fn, callback, errback, timeout, interval) {
  const endTime = Number(new Date()) + (timeout || 2000);
  interval = interval || 100;

  (function p() {
    // If the condition is met, we're done!
    if (fn()) {
      callback();
    } else if (Number(new Date()) < endTime) {
      // If the condition isn't met but the timeout hasn't elapsed, go again
      setTimeout(p, interval);
    } else {
       // Didn't match and too much time, reject!
      errback(new Error(`timed out for ${fn}: ${arguments}`)); // eslint-disable-line
    }
  }());
}
