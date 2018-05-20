/**
 * Fake redis in-memory array
 * @export
 * @class FakeRedis
 */
export default class FakeRedis {
  /**
   * Creates an instance of FakeRedis.
   * Initializes a new database
   * @memberof FakeRedis
   */
  constructor() {
    this.database = {};
  }
  /**
   * Set a new key in the database
   * @param {any} key key to be set
   * @param {any} value value for key
   * @returns {string} ok for success
   * @memberof FakeRedis
   */
  set(key, value) {
    return new Promise((resolve) => {
      this.database[key] = value;
      return resolve('OK');
    });
  }
  /**
   * Get the value of a key in database
   * @param {any} key key to get value
   * @returns {sting} value
   * @memberof FakeRedis
   */
  get(key) {
    return new Promise(resolve => resolve(this.database[key]));
  }

  /**
   * Store a new value into set in database
   *
   * @param {any} key key to set
   * @param {any} value value to push to set
   * @returns {array} arrz
   * @memberof FakeRedis
   */
  sadd(key, value) {
    return new Promise((resolve) => {
      let lengthOfSet = 0;

      if (this.database[key]) {
        lengthOfSet = this.database[key].size;
        this.database[key].add(value);
      } else {
        this.database[key] = new Set();
        this.database[key].add(value);
      }

      return resolve(this.database[key].size - lengthOfSet);
    });
  }
  /**
   * Return all elements in the given set
   *
   * @param {any} key the set in question
   * @returns {integer} the number of elements added to set
   * @memberof FakeRedis
   */
  smembers(key) {
    return new Promise((resolve, reject) => {
      const value = this.database[key];
      if (value) {
        if (value instanceof Set) {
          return resolve(Array.from(this.database[key]));
        }

        return reject(new Error('WRONGTYPE Operation against a key holding the wrong kind of value'));
      }

      return resolve([]);
    });
  }


  /**
   * Removes an item from a redis set
   *
   * @param {string} key key of set
   * @param {string} value item to remove from set
   * @returns {integer} number of elements removed
   * @memberof FakeRedis
   */
  srem(key, value) {
    return new Promise((resolve) => {
      let lengthOfSet = 0;
      const set = this.database[key];
      if (set) {
        lengthOfSet = set.size;
        set.delete(value);
        return resolve(lengthOfSet - set.size);
      }

      return resolve(0);
    });
  }
}
