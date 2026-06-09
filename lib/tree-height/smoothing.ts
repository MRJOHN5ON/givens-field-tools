export class RollingAverage {
  private readonly maxSize: number;
  private readonly buffer: number[] = [];

  constructor(maxSize: number) {
    this.maxSize = Math.max(1, maxSize);
  }

  push(value: number): number {
    if (!Number.isFinite(value)) {
      return this.average();
    }

    this.buffer.push(value);
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }

    return this.average();
  }

  reset(): void {
    this.buffer.length = 0;
  }

  average(): number {
    if (this.buffer.length === 0) return 0;
    const sum = this.buffer.reduce((total, value) => total + value, 0);
    return sum / this.buffer.length;
  }
}
