export class MaxHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }

  getDeviation(item) {
    if (!item || item.budgeted === 0) return 0;
    return ((item.amount - item.budgeted) / item.budgeted) * 100;
  }

  insert(item) {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  heapifyUp(index) {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    while (
      currentIndex > 0 &&
      this.getDeviation(this.heap[currentIndex]) > this.getDeviation(this.heap[parentIndex])
    ) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return max;
  }

  heapifyDown(index) {
    let maxIndex = index;
    const leftIndex = this.getLeftChildIndex(index);
    const rightIndex = this.getRightChildIndex(index);
    const size = this.heap.length;

    if (
      leftIndex < size &&
      this.getDeviation(this.heap[leftIndex]) > this.getDeviation(this.heap[maxIndex])
    ) {
      maxIndex = leftIndex;
    }

    if (
      rightIndex < size &&
      this.getDeviation(this.heap[rightIndex]) > this.getDeviation(this.heap[maxIndex])
    ) {
      maxIndex = rightIndex;
    }

    if (index !== maxIndex) {
      this.swap(index, maxIndex);
      this.heapifyDown(maxIndex);
    }
  }

  heapify(arr) {
    this.heap = [...arr];
    const firstNonLeaf = Math.floor(this.heap.length / 2) - 1;
    for (let i = firstNonLeaf; i >= 0; i--) {
      this.heapifyDown(i);
    }
  }
}
