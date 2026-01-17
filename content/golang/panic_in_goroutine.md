---
title: Goroutine 中出现 panic 会发生什么
tags:
    - Golang
    - Goroutine
    - panic
date: 2026-01-17
order: 1
---

:::[!danger] 如果一个 Goroutine 发生了 panic 且没有被 recover 捕获，会导致整个程序崩溃退出
:::

## 导致整个进程崩溃

如果任何一个子 Goroutine 发生了 panic，且该 Goroutine 内部没有使用 `defer` + `recover` 来拦截它，那么整个程序（包括主 Goroutine 和其他所有正在运行的 Goroutine）都会立即终止。

## 执行 Defer 函数
在 Goroutine 崩溃之前，Go 运行时会按照后进先出（LIFO）的顺序执行该 Goroutine 中所有已注册的 `defer` 函数。
*   如果在这些 `defer` 函数中调用了 `recover()`，panic 过程会被停止，该 Goroutine 可以继续生存（通常是在 `defer` 里处理完后正常退出）。
*   如果没有 `recover()`，在执行完所有 `defer` 后，崩溃会传播到顶层。


## 无法跨 Goroutine 捕获

:::[!danger] 你不能在一个 Goroutine 中通过 `recover` 捕获另一个 Goroutine 中发生的 panic。
:::

```go
func main() {
    // 这种写法无法捕获子 Goroutine 的 panic
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered in main")
        }
    }()

    go func() {
        panic("panic in child") // 这会导致整个程序崩溃
    }()

    time.Sleep(time.Second)
}
```

### 最佳实践建议
为了保证程序的健壮性，通常在创建重要的 Goroutine 时，会在其内部第一行注册一个用于捕获 panic 的 `defer` 函数：

```go
go func() {
    defer func() {
        if r := recover(); r != nil {
            log.Printf("Recovered from panic: %v", r)
            // 可以在这里进行错误上报或清理工作
        }
    }()
    
    // 实际业务逻辑
    doSomething()
}()
```

## 总结
- **范围**：Panic 的捕获必须在同一个 Goroutine 内进行（隔离性）。
- **后果**：若未捕获，会导致整个进程崩溃（全局性）。