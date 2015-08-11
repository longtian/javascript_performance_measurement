# OneGC

> 把 v8 引擎垃圾回收的过程可视化。

## V8 的 Heap 结构

[v8源码注释](https://github.com/joyent/node/blob/d13d7f74d794340ac5e126cfb4ce507fe0f803d5/deps/v8/src/heap/spaces.h#L21)

```
// -----------------------------------------------------------------------------
// Heap structures:
//
// A JS heap consists of a young generation, an old generation, and a large
// object space. The young generation is divided into two semispaces. A
// scavenger implements Cheney's copying algorithm. The old generation is
// separated into a map space and an old object space. The map space contains
// all (and only) map objects, the rest of old objects go into the old space.
// The old generation is collected by a mark-sweep-compact collector.
//
// The semispaces of the young generation are contiguous.  The old and map
// spaces consists of a list of pages. A page has a page header and an object
// area.
//
// There is a separate large object space for objects larger than
// Page::kMaxHeapObjectSize, so that they do not have to move during
// collection. The large object space is paged. Pages in large object space
// may be larger than the page size.
//
// A store-buffer based write barrier is used to keep track of intergenerational
// references.  See heap/store-buffer.h.
//
// During scavenges and mark-sweep collections we sometimes (after a store
// buffer overflow) iterate intergenerational pointers without decoding heap
// object maps so if the page belongs to old pointer space or large object
// space it is essential to guarantee that the page does not contain any
// garbage pointers to new space: every pointer aligned word which satisfies
// the Heap::InNewSpace() predicate must be a pointer to a live heap object in
// new space. Thus objects in old pointer and large object spaces should have a
// special layout (e.g. no bare integer fields). This requirement does not
// apply to map space which is iterated in a special fashion. However we still
// require pointer fields of dead maps to be cleaned.
//
// To enable lazy cleaning of old space pages we can mark chunks of the page
// as being garbage.  Garbage sections are marked with a special map.  These
// sections are skipped when scanning the page, even if we are otherwise
// scanning without regard for object boundaries.  Garbage sections are chained
// together to form a free list after a GC.  Garbage sections created outside
// of GCs by object trunctation etc. may not be in the free list chain.  Very
// small free spaces are ignored, they need only be cleaned of bogus pointers
// into new space.
//
// Each page may have up to one special garbage section.  The start of this
// section is denoted by the top field in the space.  The end of the section
// is denoted by the limit field in the space.  This special garbage section
// is not marked with a free space map in the data.  The point of this section
// is to enable linear allocation without having to constantly update the byte
// array every time the top field is updated and a new object is created.  The
// special garbage section is not in the chain of garbage sections.
//
// Since the top and limit fields are in the space, not the page, only one page
// has a special garbage section, and if the top and limit are equal then there
// is no special garbage section.
```

关键字

- Young Generation

- Old Generation

- Large Object Space

## 如何开启 V8 的 GC 日志 

使用 `node --v8-options | grep gc` 可以查看所有和 GC 相关的选项。

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

重点关注的选项

- `--trace_gc` 
- `--trace_gc_nvp` 
- `--trace_gc_verbose`

这些选项之间有叠加和覆盖的关系，对应的关系可以从源码中找到：

[void GCTracer::Stop()](https://github.com/joyent/node/blob/d13d7f74d794340ac5e126cfb4ce507fe0f803d5/deps/v8/src/heap/gc-tracer.cc#L174)

```
if (FLAG_trace_gc) {
    if (FLAG_trace_gc_nvp)
      PrintNVP();
    else
      Print();

    heap_->PrintShortHeapStatistics();
  }
```

[void Heap::PrintShortHeapStatistics()](https://github.com/joyent/node/blob/d13d7f74d794340ac5e126cfb4ce507fe0f803d5/deps/v8/src/heap/heap.cc#L316)

```
void Heap::PrintShortHeapStatistics() {
  if (!FLAG_trace_gc_verbose) return;
  ...
```

如果启动 Node.JS 应用的时候开启了 `--trace-gc` 选项，但是不加 `--trace_gc_nvp` ，则每次GC后输出一行简要的信息。
如果加上 `--trace_gc_verbose` 则输出一些列的键值对。

示例1： `node --trace_gc  index.js`

输出：

```
[10189]      682 ms: Scavenge 2.3 (36.0) -> 1.9 (37.0) MB, 1 ms [Runtime::PerformGC].
```

示例2： `node --trace_gc --trace_gc_nvp  index.js`

输出：

```
[9893]      636 ms: pause=0 mutator=0 gc=s external=0 mark=0 sweep=0 sweepns=0 evacuate=0 new_new=0 root_new=0 old_new=0 compaction_ptrs=0 intracompaction_ptrs=0 misc_compaction=0 total_size_before=2398448 total_size_after=2017168 holes_size_before=169032 holes_size_after=176640 allocated=2398448 promoted=392648 stepscount=0 stepstook=0 
```

### 键值对中每个属性的含义

[v8源码](https://github.com/joyent/node/blob/d13d7f74d794340ac5e126cfb4ce507fe0f803d5/deps/v8/src/heap/gc-tracer.cc#L241)

属性|变量|解释
----|----|----
pause|duration
mutator|spent_in_mutator
gc|TypeName(true)
external|
mark|
sweep|
sweepns|
sweepos|
sweepcode|
sweepcell|
sweepmap|
evacuate|
new_new|
root_new|
old_new|
compaction_ptrs|
intracompaction_ptrs|
misc_compaction|
weakcollection_process|
weakcollection_clear|
weakcollection_abort|
total_size_before|
total_size_after|
holes_size_before|
holes_size_after|
allocated|
promoted|
nodes_died_in_new|
nodes_copied_in_new|
nodes_promoted|
promotion_rate|
semi_space_copy_rate|
steps_count|
steps_took|
longest_step|
incremental_marking_throughput|

### GC 结束后输出内存信息

示例3: `node --trace_gc --trace_gc_verbose  index.js`

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

## 操作内存如何分配

V8 对内存的管理和与内存分配相关的系统调用密切相关：

- mmap
- munmap

**`mmap(start,length,prot,flags,fd,offset)`** 将一个文件或其它对象映射进内存。

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

**`munmap(start,length)`**  删除特定区域的对象映射。如果映射关系解除，访问原来的地址将发生段错误。

**start**
映射区的起点

**length**
映射区的长度

实际工作中可以使用 `strace` 记录系统调用。

```
sudo strace -p pid -e mmap,munmap -ttt
```

## 用于测试的文件

[index.js](https://github.com/wyvernnot/javascript_performance_measurement/tree/gh-pages/garbage_collector/example/index.js)

## 参考资料

[Linux内存管理之mmap详解](http://blog.chinaunix.net/uid-26669729-id-3077015.html)

[内存分配器 (Memory Allocator)](http://blog.csdn.net/horkychen/article/details/35735103)
