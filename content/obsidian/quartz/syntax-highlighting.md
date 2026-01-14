---
title: 代码高亮使用
tags:
  - Quartz
  - Markdown
  - 代码高亮
date: 2026-01-14
order: 4
---

## 标准代码框

````
```ts
export function trimPathSuffix(fp: string): string {
  fp = clientSideSlug(fp)
  let [cleanPath, anchor] = fp.split("#", 2)
  anchor = anchor === undefined ? "" : "#" + anchor
  return cleanPath + anchor
}
```
````

```ts
export function trimPathSuffix(fp: string): string {
  fp = clientSideSlug(fp)
  let [cleanPath, anchor] = fp.split("#", 2)
  anchor = anchor === undefined ? "" : "#" + anchor
  return cleanPath + anchor
}
```



> [!info] 参考
> 更多关于行高亮的详细说明，请参考 [Quartz 官方文档 - Line Highlighting](https://quartz.jzhao.xyz/features/syntax-highlighting#line-highlighting)。

## 行高亮

````
```js {2-3,6}
```
````

```js {2-3,6}
export function trimPathSuffix(fp: string): string {
  fp = clientSideSlug(fp)
  let [cleanPath, anchor] = fp.split("#", 2)
  anchor = anchor === undefined ? "" : "#" + anchor
 
  return cleanPath + anchor
}
```

## 单词高亮

````
```js /useState/
const [age, setAge] = useState(50);
const [name, setName] = useState('Taylor');
```
````

```js /useState/
const [age, setAge] = useState(50);
const [name, setName] = useState('Taylor');
```

## 行内高亮

```
This is an array `[1, 2, 3]{:js}` of numbers 1 through 3.
```

This is an array `[1, 2, 3]{:js}` of numbers 1 through 3.

## 特定行号

````
```js showLineNumbers{20}
```
````

```js showLineNumbers{20}
export function trimPathSuffix(fp: string): string {
  fp = clientSideSlug(fp)
  let [cleanPath, anchor] = fp.split("#", 2)
  anchor = anchor === undefined ? "" : "#" + anchor
 
  return cleanPath + anchor
}
```

## 转义代码块

通过使用比前一个围栏多一个反引号的另一层反引号围栏来在代码块内部设置代码块格式。

`````
````
```js /useState/
const [age, setAge] = useState(50);
const [name, setName] = useState('Taylor');
```
````
`````

````
```js /useState/
const [age, setAge] = useState(50);
const [name, setName] = useState('Taylor');
```
````
