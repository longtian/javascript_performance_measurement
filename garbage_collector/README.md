# OneGC

## 用于测试的文件

[index.js](https://github.com/wyvernnot/javascript_performance_measurement/tree/gh-pages/garbage_collector/index.js)

## 观测工具

### top

```
top -p pid
```

### strace

```
sudo strace -p pid -e mmap.munmap -ttt
```

## 和内存分配有关的系统调用

### `mmap(start,length,prot,flags,fd,offset)` 将一个文件或其它对象映射进内存

**start**
映射区开始地址

**length**
映射区的长度

**prot**
内存保护标志

**flags**
对象的类型

**fd**
文件描述符

**offset**
被映射对象内容的起点

### `munmap(start,length)` 删除特定区域的对象映射

**start**
映射区的起点

**length**
映射区的长度

__如果映射关系解除，访问原来的地址将发生段错误__


## V8 和 GC 相关的选项

### `node --v8-options | grep gc`

```
  --expose_gc (expose gc extension)
  --gc_global (always perform global GCs)
  --gc_interval (garbage collect after <n> allocations)
  --trace_gc (print one trace line following each garbage collection)
  --trace_gc_nvp (print one detailed trace line in name=value format after each garbage collection)
  --trace_gc_ignore_scavenger (do not print trace line after scavenger collection)
  --print_cumulative_gc_stat (print cumulative GC statistics in name=value format on exit)
  --trace_gc_verbose (print more details following each garbage collection)
  --flush_code (flush code that we expect not to use again before full gc)
  --track_gc_object_stats (track object counts and memory usage)
  --cleanup_code_caches_at_gc (Flush inline caches prior to mark compact collection and flush code caches in maps during mark compact cycle.)
  --log_gc (Log heap samples on garbage collection for the hp2ps tool.)
  --gc_fake_mmap (Specify the name of the file for fake gc mmap used in ll_prof)
```

### `node --trace_gc  index.js`

```
[10189]      682 ms: Scavenge 2.3 (36.0) -> 1.9 (37.0) MB, 1 ms [Runtime::PerformGC].
```

### `node --trace_gc --trace_gc_verbose  index.js`

```
[9800]     9870 ms: Scavenge 3.0 (37.0) -> 2.2 (37.0) MB, 1 ms [allocation failure].
[9800] Memory allocator,   used:  37904 KB, available: 1461232 KB
[9800] New space,          used:     87 KB, available:   1960 KB, committed:   4096 KB
[9800] Old pointers,       used:   1011 KB, available:    164 KB, committed:   1519 KB
[9800] Old data space,     used:    579 KB, available:      7 KB, committed:   1199 KB
[9800] Code space,         used:    430 KB, available:      0 KB, committed:    996 KB
[9800] Map space,          used:     93 KB, available:      0 KB, committed:    128 KB
[9800] Cell space,         used:     15 KB, available:      0 KB, committed:    128 KB
[9800] Large object space, used:      0 KB, available: 1460191 KB, committed:      0 KB
[9800] All spaces,         used:   2218 KB, available:   2132 KB, committed:   8067 KB
[9800] Total time spent in GC  : 4 ms
```

### `node --trace_gc --trace_gc_nvp  index.js`

```
[9893]      636 ms: pause=0 mutator=0 gc=s external=0 mark=0 sweep=0 sweepns=0 evacuate=0 new_new=0 root_new=0 old_new=0 compaction_ptrs=0 intracompaction_ptrs=0 misc_compaction=0 total_size_before=2398448 total_size_after=2017168 holes_size_before=169032 holes_size_after=176640 allocated=2398448 promoted=392648 stepscount=0 stepstook=0 
```

### `node --trace_gc --trace_gc_verbose --trace_gc_nvp  index.js`

```
[9854]     3335 ms: pause=0 mutator=2691 gc=s external=0 mark=0 sweep=0 sweepns=0 evacuate=0 new_new=0 root_new=0 old_new=0 compaction_ptrs=0 intracompaction_ptrs=0 misc_compaction=0 total_size_before=2791128 total_size_after=2090832 holes_size_before=179336 holes_size_after=179336 allocated=773944 promoted=257920 stepscount=0 stepstook=0 
[9854] Memory allocator,   used:  37904 KB, available: 1461232 KB
[9854] New space,          used:     71 KB, available:    952 KB, committed:   2048 KB
[9854] Old pointers,       used:   1011 KB, available:    167 KB, committed:   1519 KB
[9854] Old data space,     used:    418 KB, available:      7 KB, committed:   1199 KB
[9854] Code space,         used:    430 KB, available:      0 KB, committed:    996 KB
[9854] Map space,          used:     93 KB, available:      0 KB, committed:    128 KB
[9854] Cell space,         used:     15 KB, available:      0 KB, committed:    128 KB
[9854] Large object space, used:      0 KB, available: 1460191 KB, committed:      0 KB
[9854] All spaces,         used:   2041 KB, available:   1127 KB, committed:   6019 KB
[9854] Total time spent in GC  : 1 ms
```

## 参考资料

[Linux内存管理之mmap详解](http://blog.chinaunix.net/uid-26669729-id-3077015.html)