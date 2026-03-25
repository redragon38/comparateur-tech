/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\n// ── Resize : désactive les transitions pendant le redimensionnement ──\nfunction useResizeTransitionGuard() {\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        let t;\n        const onResize = ()=>{\n            document.body.classList.add(\"resize-no-transition\");\n            clearTimeout(t);\n            t = setTimeout(()=>document.body.classList.remove(\"resize-no-transition\"), 200);\n        };\n        window.addEventListener(\"resize\", onResize, {\n            passive: true\n        });\n        return ()=>window.removeEventListener(\"resize\", onResize);\n    }, []);\n}\n// ── View Transitions API : animation inter-pages ──\nfunction useViewTransitions() {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        if (typeof document === \"undefined\") return;\n        if (!document.startViewTransition) return;\n        const handleStart = (url)=>{\n        // On déclenche la View Transition côté CSS via ::view-transition-*\n        };\n        router.events.on(\"routeChangeStart\", handleStart);\n        return ()=>router.events.off(\"routeChangeStart\", handleStart);\n    }, [\n        router\n    ]);\n}\n// ── Scroll to top sur changement de route ──\nfunction useScrollToTop() {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        const onRouteChange = ()=>window.scrollTo({\n                top: 0,\n                behavior: \"instant\"\n            });\n        router.events.on(\"routeChangeComplete\", onRouteChange);\n        return ()=>router.events.off(\"routeChangeComplete\", onRouteChange);\n    }, [\n        router\n    ]);\n}\n// ── Prefetch des pages au survol des liens ──\nfunction useLinkPrefetch() {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{\n        const onMouseOver = (e)=>{\n            const link = e.target.closest(\"a[href]\");\n            if (!link) return;\n            const href = link.getAttribute(\"href\");\n            if (href && href.startsWith(\"/\") && !href.startsWith(\"//\")) {\n                router.prefetch(href).catch(()=>{});\n            }\n        };\n        document.addEventListener(\"mouseover\", onMouseOver, {\n            passive: true\n        });\n        return ()=>document.removeEventListener(\"mouseover\", onMouseOver);\n    }, [\n        router\n    ]);\n}\nfunction App({ Component, pageProps }) {\n    useResizeTransitionGuard();\n    useViewTransitions();\n    useScrollToTop();\n    useLinkPrefetch();\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_2___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"meta\", {\n                        name: \"viewport\",\n                        content: \"width=device-width, initial-scale=1, viewport-fit=cover\"\n                    }, void 0, false, {\n                        fileName: \"/Users/lucasbonin/Downloads/comparateur-tech-main 12/frontend/pages/_app.js\",\n                        lineNumber: 73,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"preconnect\",\n                        href: \"https://fonts.googleapis.com\"\n                    }, void 0, false, {\n                        fileName: \"/Users/lucasbonin/Downloads/comparateur-tech-main 12/frontend/pages/_app.js\",\n                        lineNumber: 75,\n                        columnNumber: 9\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"dns-prefetch\",\n                        href: \"https://comparateur-tech.com\"\n                    }, void 0, false, {\n                        fileName: \"/Users/lucasbonin/Downloads/comparateur-tech-main 12/frontend/pages/_app.js\",\n                        lineNumber: 76,\n                        columnNumber: 9\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/lucasbonin/Downloads/comparateur-tech-main 12/frontend/pages/_app.js\",\n                lineNumber: 72,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/Users/lucasbonin/Downloads/comparateur-tech-main 12/frontend/pages/_app.js\",\n                lineNumber: 78,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUE4QjtBQUNGO0FBQ2E7QUFDRjtBQUV2Qyx3RUFBd0U7QUFDeEUsU0FBU0k7SUFDUEgsZ0RBQVNBLENBQUM7UUFDUixJQUFJSTtRQUNKLE1BQU1DLFdBQVc7WUFDZkMsU0FBU0MsSUFBSSxDQUFDQyxTQUFTLENBQUNDLEdBQUcsQ0FBQztZQUM1QkMsYUFBYU47WUFDYkEsSUFBSU8sV0FBVyxJQUFNTCxTQUFTQyxJQUFJLENBQUNDLFNBQVMsQ0FBQ0ksTUFBTSxDQUFDLHlCQUF5QjtRQUMvRTtRQUNBQyxPQUFPQyxnQkFBZ0IsQ0FBQyxVQUFVVCxVQUFVO1lBQUVVLFNBQVM7UUFBSztRQUM1RCxPQUFPLElBQU1GLE9BQU9HLG1CQUFtQixDQUFDLFVBQVVYO0lBQ3BELEdBQUcsRUFBRTtBQUNQO0FBRUEscURBQXFEO0FBQ3JELFNBQVNZO0lBQ1AsTUFBTUMsU0FBU2hCLHNEQUFTQTtJQUV4QkYsZ0RBQVNBLENBQUM7UUFDUixJQUFJLE9BQU9NLGFBQWEsYUFBYTtRQUNyQyxJQUFJLENBQUNBLFNBQVNhLG1CQUFtQixFQUFFO1FBRW5DLE1BQU1DLGNBQWMsQ0FBQ0M7UUFDbkIsbUVBQW1FO1FBQ3JFO1FBRUFILE9BQU9JLE1BQU0sQ0FBQ0MsRUFBRSxDQUFDLG9CQUFvQkg7UUFDckMsT0FBTyxJQUFNRixPQUFPSSxNQUFNLENBQUNFLEdBQUcsQ0FBQyxvQkFBb0JKO0lBQ3JELEdBQUc7UUFBQ0Y7S0FBTztBQUNiO0FBRUEsOENBQThDO0FBQzlDLFNBQVNPO0lBQ1AsTUFBTVAsU0FBU2hCLHNEQUFTQTtJQUN4QkYsZ0RBQVNBLENBQUM7UUFDUixNQUFNMEIsZ0JBQWdCLElBQU1iLE9BQU9jLFFBQVEsQ0FBQztnQkFBRUMsS0FBSztnQkFBR0MsVUFBVTtZQUFVO1FBQzFFWCxPQUFPSSxNQUFNLENBQUNDLEVBQUUsQ0FBQyx1QkFBdUJHO1FBQ3hDLE9BQU8sSUFBTVIsT0FBT0ksTUFBTSxDQUFDRSxHQUFHLENBQUMsdUJBQXVCRTtJQUN4RCxHQUFHO1FBQUNSO0tBQU87QUFDYjtBQUVBLCtDQUErQztBQUMvQyxTQUFTWTtJQUNQLE1BQU1aLFNBQVNoQixzREFBU0E7SUFDeEJGLGdEQUFTQSxDQUFDO1FBQ1IsTUFBTStCLGNBQWMsQ0FBQ0M7WUFDbkIsTUFBTUMsT0FBT0QsRUFBRUUsTUFBTSxDQUFDQyxPQUFPLENBQUM7WUFDOUIsSUFBSSxDQUFDRixNQUFNO1lBQ1gsTUFBTUcsT0FBT0gsS0FBS0ksWUFBWSxDQUFDO1lBQy9CLElBQUlELFFBQVFBLEtBQUtFLFVBQVUsQ0FBQyxRQUFRLENBQUNGLEtBQUtFLFVBQVUsQ0FBQyxPQUFPO2dCQUMxRHBCLE9BQU9xQixRQUFRLENBQUNILE1BQU1JLEtBQUssQ0FBQyxLQUFPO1lBQ3JDO1FBQ0Y7UUFDQWxDLFNBQVNRLGdCQUFnQixDQUFDLGFBQWFpQixhQUFhO1lBQUVoQixTQUFTO1FBQUs7UUFDcEUsT0FBTyxJQUFNVCxTQUFTVSxtQkFBbUIsQ0FBQyxhQUFhZTtJQUN6RCxHQUFHO1FBQUNiO0tBQU87QUFDYjtBQUVlLFNBQVN1QixJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ2xEeEM7SUFDQWM7SUFDQVE7SUFDQUs7SUFFQSxxQkFDRTs7MEJBQ0UsOERBQUMvQixrREFBSUE7O2tDQUNILDhEQUFDNkM7d0JBQUtDLE1BQUs7d0JBQVdDLFNBQVE7Ozs7OztrQ0FFOUIsOERBQUNiO3dCQUFLYyxLQUFJO3dCQUFhWCxNQUFLOzs7Ozs7a0NBQzVCLDhEQUFDSDt3QkFBS2MsS0FBSTt3QkFBZVgsTUFBSzs7Ozs7Ozs7Ozs7OzBCQUVoQyw4REFBQ007Z0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7QUFHOUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb21wYXJhdGV1ci10ZWNoLXBsYXRmb3JtLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xuaW1wb3J0IEhlYWQgZnJvbSAnbmV4dC9oZWFkJ1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJ1xuXG4vLyDilIDilIAgUmVzaXplIDogZMOpc2FjdGl2ZSBsZXMgdHJhbnNpdGlvbnMgcGVuZGFudCBsZSByZWRpbWVuc2lvbm5lbWVudCDilIDilIBcbmZ1bmN0aW9uIHVzZVJlc2l6ZVRyYW5zaXRpb25HdWFyZCgpIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgdFxuICAgIGNvbnN0IG9uUmVzaXplID0gKCkgPT4ge1xuICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdyZXNpemUtbm8tdHJhbnNpdGlvbicpXG4gICAgICBjbGVhclRpbWVvdXQodClcbiAgICAgIHQgPSBzZXRUaW1lb3V0KCgpID0+IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgncmVzaXplLW5vLXRyYW5zaXRpb24nKSwgMjAwKVxuICAgIH1cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25SZXNpemUsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25SZXNpemUpXG4gIH0sIFtdKVxufVxuXG4vLyDilIDilIAgVmlldyBUcmFuc2l0aW9ucyBBUEkgOiBhbmltYXRpb24gaW50ZXItcGFnZXMg4pSA4pSAXG5mdW5jdGlvbiB1c2VWaWV3VHJhbnNpdGlvbnMoKSB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgcmV0dXJuXG4gICAgaWYgKCFkb2N1bWVudC5zdGFydFZpZXdUcmFuc2l0aW9uKSByZXR1cm5cblxuICAgIGNvbnN0IGhhbmRsZVN0YXJ0ID0gKHVybCkgPT4ge1xuICAgICAgLy8gT24gZMOpY2xlbmNoZSBsYSBWaWV3IFRyYW5zaXRpb24gY8O0dMOpIENTUyB2aWEgOjp2aWV3LXRyYW5zaXRpb24tKlxuICAgIH1cblxuICAgIHJvdXRlci5ldmVudHMub24oJ3JvdXRlQ2hhbmdlU3RhcnQnLCBoYW5kbGVTdGFydClcbiAgICByZXR1cm4gKCkgPT4gcm91dGVyLmV2ZW50cy5vZmYoJ3JvdXRlQ2hhbmdlU3RhcnQnLCBoYW5kbGVTdGFydClcbiAgfSwgW3JvdXRlcl0pXG59XG5cbi8vIOKUgOKUgCBTY3JvbGwgdG8gdG9wIHN1ciBjaGFuZ2VtZW50IGRlIHJvdXRlIOKUgOKUgFxuZnVuY3Rpb24gdXNlU2Nyb2xsVG9Ub3AoKSB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Sb3V0ZUNoYW5nZSA9ICgpID0+IHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogMCwgYmVoYXZpb3I6ICdpbnN0YW50JyB9KVxuICAgIHJvdXRlci5ldmVudHMub24oJ3JvdXRlQ2hhbmdlQ29tcGxldGUnLCBvblJvdXRlQ2hhbmdlKVxuICAgIHJldHVybiAoKSA9PiByb3V0ZXIuZXZlbnRzLm9mZigncm91dGVDaGFuZ2VDb21wbGV0ZScsIG9uUm91dGVDaGFuZ2UpXG4gIH0sIFtyb3V0ZXJdKVxufVxuXG4vLyDilIDilIAgUHJlZmV0Y2ggZGVzIHBhZ2VzIGF1IHN1cnZvbCBkZXMgbGllbnMg4pSA4pSAXG5mdW5jdGlvbiB1c2VMaW5rUHJlZmV0Y2goKSB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25Nb3VzZU92ZXIgPSAoZSkgPT4ge1xuICAgICAgY29uc3QgbGluayA9IGUudGFyZ2V0LmNsb3Nlc3QoJ2FbaHJlZl0nKVxuICAgICAgaWYgKCFsaW5rKSByZXR1cm5cbiAgICAgIGNvbnN0IGhyZWYgPSBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpXG4gICAgICBpZiAoaHJlZiAmJiBocmVmLnN0YXJ0c1dpdGgoJy8nKSAmJiAhaHJlZi5zdGFydHNXaXRoKCcvLycpKSB7XG4gICAgICAgIHJvdXRlci5wcmVmZXRjaChocmVmKS5jYXRjaCgoKSA9PiB7fSlcbiAgICAgIH1cbiAgICB9XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgb25Nb3VzZU92ZXIsIHsgcGFzc2l2ZTogdHJ1ZSB9KVxuICAgIHJldHVybiAoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBvbk1vdXNlT3ZlcilcbiAgfSwgW3JvdXRlcl0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgdXNlUmVzaXplVHJhbnNpdGlvbkd1YXJkKClcbiAgdXNlVmlld1RyYW5zaXRpb25zKClcbiAgdXNlU2Nyb2xsVG9Ub3AoKVxuICB1c2VMaW5rUHJlZmV0Y2goKVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxIZWFkPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEsIHZpZXdwb3J0LWZpdD1jb3ZlclwiIC8+XG4gICAgICAgIHsvKiBQcsOpY29ubmV4aW9ucyBETlMgY3JpdGlxdWVzICovfVxuICAgICAgICA8bGluayByZWw9XCJwcmVjb25uZWN0XCIgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb21cIiAvPlxuICAgICAgICA8bGluayByZWw9XCJkbnMtcHJlZmV0Y2hcIiBocmVmPVwiaHR0cHM6Ly9jb21wYXJhdGV1ci10ZWNoLmNvbVwiIC8+XG4gICAgICA8L0hlYWQ+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC8+XG4gIClcbn1cbiJdLCJuYW1lcyI6WyJIZWFkIiwidXNlRWZmZWN0IiwidXNlUmVmIiwidXNlUm91dGVyIiwidXNlUmVzaXplVHJhbnNpdGlvbkd1YXJkIiwidCIsIm9uUmVzaXplIiwiZG9jdW1lbnQiLCJib2R5IiwiY2xhc3NMaXN0IiwiYWRkIiwiY2xlYXJUaW1lb3V0Iiwic2V0VGltZW91dCIsInJlbW92ZSIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJwYXNzaXZlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInVzZVZpZXdUcmFuc2l0aW9ucyIsInJvdXRlciIsInN0YXJ0Vmlld1RyYW5zaXRpb24iLCJoYW5kbGVTdGFydCIsInVybCIsImV2ZW50cyIsIm9uIiwib2ZmIiwidXNlU2Nyb2xsVG9Ub3AiLCJvblJvdXRlQ2hhbmdlIiwic2Nyb2xsVG8iLCJ0b3AiLCJiZWhhdmlvciIsInVzZUxpbmtQcmVmZXRjaCIsIm9uTW91c2VPdmVyIiwiZSIsImxpbmsiLCJ0YXJnZXQiLCJjbG9zZXN0IiwiaHJlZiIsImdldEF0dHJpYnV0ZSIsInN0YXJ0c1dpdGgiLCJwcmVmZXRjaCIsImNhdGNoIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwibWV0YSIsIm5hbWUiLCJjb250ZW50IiwicmVsIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();