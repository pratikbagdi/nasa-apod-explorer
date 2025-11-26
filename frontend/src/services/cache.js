class MemoryCache {
  constructor(ttl, maxSize) {
    this.ttl = ttl;
    this.maxSize = maxSize;
    this.cache = new Map();
    this.timers = new Map();
    this.hits = 0;
    this.misses = 0;
    console.log(`Cache initialized: TTL=${ttl}ms, MaxSize=${maxSize}`);
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      console.log(`Cache full, evicting: ${firstKey}`);
      this.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });

    const timer = setTimeout(() => {
      console.log(`TTL expired: ${key}`);
      this.delete(key);
    }, this.ttl);

    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }
    this.timers.set(key, timer);

    console.log(`Cache set: ${key}, size: ${this.cache.size}/${this.maxSize}`);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      this.misses++;
      console.log(`Cache miss: ${key}`);
      return null;
    }

    if (Date.now() - item.timestamp > this.ttl) {
      console.log(`Cache expired: ${key}`);
      this.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    console.log(`Cache hit: ${key}`);
    return item.value;
  }

  delete(key) {
    const existed = this.cache.delete(key);
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    if (existed) {
      console.log(`Cache deleted: ${key}, size: ${this.cache.size}/${this.maxSize}`);
    }
    return existed;
  }

  clear() {
    console.log('Cache cleared');
    this.cache.clear();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.hits = 0;
    this.misses = 0;
  }

  size() {
    return this.cache.size;
  }

  getStats() {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(2) : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      hits: this.hits,
      misses: this.misses,
      hitRate: `${hitRate}%`
    };
  }

  updateConfig(newTtl, newMaxSize) {
    if (newTtl !== undefined) {
      this.ttl = newTtl;
    }
    if (newMaxSize !== undefined) {
      this.maxSize = newMaxSize;
    }
    
    this.timers.forEach((timer, key) => {
      clearTimeout(timer);
      const newTimer = setTimeout(() => {
        this.delete(key);
      }, this.ttl);
      this.timers.set(key, newTimer);
    });
  }
}

module.exports = MemoryCache;