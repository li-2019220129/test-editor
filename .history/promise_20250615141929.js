/**
 * Promise 实现，符合 Promise/A+ 规范
 */

// Promise 状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    // 初始状态为 pending
    this.status = PENDING;
    // 成功的值
    this.value = undefined;
    // 失败的原因
    this.reason = undefined;
    // 成功回调函数队列
    this.onFulfilledCallbacks = [];
    // 失败回调函数队列
    this.onRejectedCallbacks = [];

    // 成功时执行的函数
    const resolve = (value) => {
      // 如果 value 是 Promise，则递归处理
      if (value instanceof MyPromise) {
        return value.then(resolve, reject);
      }

      // 只有状态为 pending 时才能更改状态
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 执行所有成功回调
        this.onFulfilledCallbacks.forEach((callback) => callback());
      }
    };

    // 失败时执行的函数
    const reject = (reason) => {
      // 只有状态为 pending 时才能更改状态
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        // 执行所有失败回调
        this.onRejectedCallbacks.forEach((callback) => callback());
      }
    };

    try {
      // 立即执行执行器函数
      executor(resolve, reject);
    } catch (error) {
      // 执行器出错时，将 Promise 状态变为 rejected
      reject(error);
    }
  }

  /**
   * then 方法
   * @param {Function} onFulfilled 成功回调
   * @param {Function} onRejected 失败回调
   * @returns {MyPromise} 返回一个新的 Promise
   */
  then(onFulfilled, onRejected) {
    // 参数校验，确保 onFulfilled 和 onRejected 是函数
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 创建并返回一个新的 Promise
    const promise2 = new MyPromise((resolve, reject) => {
      // 封装微任务处理逻辑
      const handleMicroTask = (callback, data) => {
        // 使用 queueMicrotask 模拟微任务
        queueMicrotask(() => {
          try {
            const result = callback(data);
            resolvePromise(promise2, result, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      if (this.status === FULFILLED) {
        // 成功状态，异步执行 onFulfilled
        handleMicroTask(onFulfilled, this.value);
      } else if (this.status === REJECTED) {
        // 失败状态，异步执行 onRejected
        handleMicroTask(onRejected, this.reason);
      } else if (this.status === PENDING) {
        // pending 状态，将回调存入队列
        this.onFulfilledCallbacks.push(() => {
          handleMicroTask(onFulfilled, this.value);
        });
        this.onRejectedCallbacks.push(() => {
          handleMicroTask(onRejected, this.reason);
        });
      }
    });

    return promise2;
  }

  /**
   * catch 方法，用于处理 rejected 状态
   * @param {Function} onRejected 失败回调
   * @returns {MyPromise} 返回一个新的 Promise
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * finally 方法，无论成功或失败都会执行
   * @param {Function} callback 回调函数
   * @returns {MyPromise} 返回一个新的 Promise
   */
  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason;
        })
    );
  }

  /**
   * 静态 resolve 方法
   * @param {any} value 要解析为 Promise 对象的值
   * @returns {MyPromise} 返回一个解析过的 Promise 对象
   */
  static resolve(value) {
    // 如果传入的是 Promise，直接返回
    if (value instanceof MyPromise) {
      return value;
    }
    // 创建一个新的 Promise，并在其中调用 resolve
    return new MyPromise((resolve) => resolve(value));
  }

  /**
   * 静态 reject 方法
   * @param {any} reason 拒绝的原因
   * @returns {MyPromise} 返回一个被拒绝的 Promise 对象
   */
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  /**
   * 静态 all 方法
   * @param {Iterable} promises 一个可迭代对象，如 Array
   * @returns {MyPromise} 返回一个 Promise 对象
   */
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("promises must be an array"));
      }

      const results = [];
      let resolvedCount = 0;
      const len = promises.length;

      // 如果传入的是空数组，直接返回空数组
      if (len === 0) {
        return resolve(results);
      }

      promises.forEach((promise, index) => {
        // 使用 MyPromise.resolve 处理非 Promise 值
        MyPromise.resolve(promise).then(
          (value) => {
            results[index] = value;
            resolvedCount++;
            // 所有 Promise 都成功时，返回结果数组
            if (resolvedCount === len) {
              resolve(results);
            }
          },
          (reason) => {
            // 任何一个 Promise 失败，整个 Promise.all 失败
            reject(reason);
          }
        );
      });
    });
  }

  /**
   * 静态 race 方法
   * @param {Iterable} promises 一个可迭代对象，如 Array
   * @returns {MyPromise} 返回一个 Promise 对象
   */
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("promises must be an array"));
      }

      // 如果传入的是空数组，则 Promise 永远处于 pending 状态
      if (promises.length === 0) {
        return;
      }

      promises.forEach((promise) => {
        // 使用 MyPromise.resolve 处理非 Promise 值
        MyPromise.resolve(promise).then(resolve, reject);
      });
    });
  }

  /**
   * 静态 allSettled 方法
   * @param {Iterable} promises 一个可迭代对象，如 Array
   * @returns {MyPromise} 返回一个 Promise 对象
   */
  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("promises must be an array"));
      }

      const results = [];
      let settledCount = 0;
      const len = promises.length;

      // 如果传入的是空数组，直接返回空数组
      if (len === 0) {
        return resolve(results);
      }

      promises.forEach((promise, index) => {
        // 使用 MyPromise.resolve 处理非 Promise 值
        MyPromise.resolve(promise).then(
          (value) => {
            results[index] = { status: "fulfilled", value };
            settledCount++;
            if (settledCount === len) {
              resolve(results);
            }
          },
          (reason) => {
            results[index] = { status: "rejected", reason };
            settledCount++;
            if (settledCount === len) {
              resolve(results);
            }
          }
        );
      });
    });
  }

  /**
   * 静态 any 方法
   * @param {Iterable} promises 一个可迭代对象，如 Array
   * @returns {MyPromise} 返回一个 Promise 对象
   */
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError("promises must be an array"));
      }

      const errors = [];
      let rejectedCount = 0;
      const len = promises.length;

      // 如果传入的是空数组，则返回 AggregateError
      if (len === 0) {
        return reject(new AggregateError([], "All promises were rejected"));
      }

      promises.forEach((promise, index) => {
        // 使用 MyPromise.resolve 处理非 Promise 值
        MyPromise.resolve(promise).then(
          (value) => {
            // 任何一个 Promise 成功，整个 Promise.any 成功
            resolve(value);
          },
          (reason) => {
            errors[index] = reason;
            rejectedCount++;
            // 所有 Promise 都失败时，返回 AggregateError
            if (rejectedCount === len) {
              reject(new AggregateError(errors, "All promises were rejected"));
            }
          }
        );
      });
    });
  }
}

/**
 * 解析 Promise 的结果
 * @param {MyPromise} promise2 新的 Promise 对象
 * @param {any} x then 方法执行结果
 * @param {Function} resolve promise2 的 resolve 函数
 * @param {Function} reject promise2 的 reject 函数
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 如果 promise2 和 x 相同，抛出类型错误
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }

  // 如果 x 是 Promise 对象
  if (x instanceof MyPromise) {
    // 如果 x 处于 pending 状态，则等待其状态改变
    if (x.status === PENDING) {
      x.then(
        (value) => resolvePromise(promise2, value, resolve, reject),
        (reason) => reject(reason)
      );
    } else if (x.status === FULFILLED) {
      // 如果 x 已经 fulfilled，用相同的值执行 promise2
      resolve(x.value);
    } else if (x.status === REJECTED) {
      // 如果 x 已经 rejected，用相同的原因拒绝 promise2
      reject(x.reason);
    }
    return;
  }

  // 如果 x 是对象或函数
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    let called = false; // 确保只调用一次

    try {
      // 尝试获取 x.then
      const then = x.then;

      // 如果 then 是函数，则将 x 作为 this 调用它
      if (typeof then === "function") {
        then.call(
          x,
          // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          // 如果 rejectPromise 以原因 r 为参数被调用，则以原因 r 拒绝 promise
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        // 如果 then 不是函数，以 x 为值 fulfill promise
        resolve(x);
      }
    } catch (e) {
      // 如果获取 x.then 或调用 x.then 抛出异常 e
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 如果 x 不是对象或函数，以 x 为值 fulfill promise
    resolve(x);
  }
}

// 导出 MyPromise 类
module.exports = MyPromise;
