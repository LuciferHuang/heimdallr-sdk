export default class CustomSet<T> {
  private items: Set<T>;

  constructor(array?: T[]) {
    this.items = new Set(array);
  }

  /**
   * @description: 向集合添加一个新元素。
   * @param {T} element
   * @return {boolean} 是否添加成功
   */
  add(element: T): boolean {
    if (!this.has(element)) {
      this.items.add(element);
      return true;
    }
    return false;
  }

  /**
   * @description: 从集合移除一个元素。
   * @param {T} element
   * @return {boolean} 是否删除成功
   */
  delete(element: T): boolean {
    if (this.has(element)) {
      return this.items.delete(element);
    }
    return false;
  }

  /**
   * @description: 如果元素在集合中，返回 true，否则返回 false。
   * @param {T} element
   * @return {boolean}
   */
  has(element: T): boolean {
    return this.items.has(element);
  }

  /**
   * @description: 返回一个包含集合中所有值（元素）的数组。
   * @return {Array<T>}
   */
  values(): T[] {
    return [...this.items];
  }

  /**
   * @description: 并集
   * @param {CustomSet} otherSet
   * @return {CustomSet}
   */
  union(otherSet: CustomSet<T>): CustomSet<T> {
    const unionSet = new CustomSet<T>();

    // 迭代两个集合，把元素都add进来
    this.values().forEach((value) => unionSet.add(value));
    otherSet.values().forEach((value) => unionSet.add(value));

    return unionSet;
  }

  /**
   * @description: 交集
   * @param {CustomSet} otherSet
   * @return {CustomSet}
   */
  intersection(otherSet: CustomSet<T>): CustomSet<T> {
    const intersectionSet = new CustomSet<T>();

    // 在当前集合中过滤掉otherSet中不存在的元素
    this.values()
      .filter((v) => otherSet.has(v))
      .forEach((v) => {
        intersectionSet.add(v);
      });

    return intersectionSet;
  }

  /**
   * @description: 差集
   * @param {CustomSet} otherSet
   * @return {CustomSet}
   */
  difference(otherSet: CustomSet<T>): CustomSet<T> {
    const differenceSet = new CustomSet<T>();

    // 在当前集合中过滤掉otherSet中也存在的元素
    this.values()
      .filter((v) => !otherSet.has(v))
      .forEach((v) => {
        differenceSet.add(v);
      });

    return differenceSet;
  }

  /**
   * @description: 是否为子集
   * @param {CustomSet} otherSet
   * @return {boolean}
   */
  isSubsetOf(otherSet: CustomSet<T>): boolean {
    if (this.size() > otherSet.size()) {
      return false;
    }

    let isSubset = true;
    // 判据：当前集合的所有元素在otherSet中都存在
    this.values().forEach((value) => {
      if (!otherSet.has(value)) {
        isSubset = false;
      }
    });

    return isSubset;
  }

  /**
   * @description: 是否为空
   * @return {boolean}
   */
  isEmpty(): boolean {
    return this.size() === 0;
  }

  /**
   * @description: 集合的元素数
   * @return {number}
   */
  size(): number {
    return this.items.size;
  }

  /**
   * @description: 清空集合
   */
  clear() {
    this.items = new Set();
  }

  /**
   * @description: 替换原生toString
   * @return {string}
   */
  toString(): string {
    return `${this.values()}`;
  }
}

const bigNameForItToU: any = {}
bigNameForItToU.b.c