# 水果电商项目代码（Vue + Spring Boot）

## 1. 项目简介
本项目为“基于 Vue 和 Spring Boot 的水果电商官网”完整代码实现，包含：
1. 前端官网（Vue 3 + Vite + Pinia + Vue Router + Axios）
2. 后端 API（Spring Boot + JPA + JWT + H2/MySQL）

已实现模块：
1. 登录注册
2. 首页推荐
3. 商品列表与详情
4. 购物车
5. 下单与订单管理
6. 个人中心（地址、收藏）

## 2. 目录结构
- backend: Spring Boot 后端服务
- frontend: Vue 前端项目
- 水果电商官网开发文档.md: 详细开发文档

## 3. 后端说明
后端默认端口：8080

默认技术与配置：
1. JWT 登录认证（拦截 /api/**）
2. 默认使用 H2 文件数据库（开箱即用）
3. 提供 MySQL 配置文件 application-mysql.yml
4. 应用启动时自动初始化演示数据

演示账号：
1. 用户名: demo
2. 手机号: 13800000000
3. 密码: 123456

后端关键接口：
1. /api/auth/* 认证接口
2. /api/products/* 商品接口
3. /api/cart/items 购物车接口
4. /api/orders/* 订单接口
5. /api/user/* 个人中心接口

## 4. 前端说明
前端默认端口：5173

功能页面：
1. 首页
2. 商品列表
3. 商品详情
4. 登录/注册
5. 购物车
6. 结算页
7. 个人中心

前端通过 Vite 代理将 /api 请求转发到 http://localhost:8080。

## 5. 运行步骤

### 5.1 启动后端
在 backend 目录执行：

```bash
mvn spring-boot:run
```


### 5.2 启动前端
在 frontend 目录执行：

```bash
npm install
npm run dev
```

浏览器访问：
http://localhost:5173

## 6. 切换 MySQL
1. 创建数据库: fruit_shop
2. 修改 backend/src/main/resources/application-mysql.yml 中账号密码
3. 使用 profile 启动：

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

## 7. 已完成的工程化要点
1. 统一响应结构 ApiResponse
2. 全局异常处理 GlobalExceptionHandler
3. JWT 鉴权拦截器
4. CORS 跨域配置
5. 前端 Axios 拦截器与 401 处理
6. 路由鉴权守卫

