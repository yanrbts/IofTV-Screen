<!--
 * @Author: daidai
 * @Date: 2022-02-28 16:16:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-25 09:18:22
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\left-center.vue
-->
<template>
    <Echart id="leftCenter" :options="options" class="left_center_inner" v-if="pageflag" ref="charts" />
    <Reacquire v-else @onclick="getData" style="line-height:200px">
        重新获取
    </Reacquire>
</template>

<script>
import WebSocketService from 'api/ws';
import * as d3 from 'd3-scale-chromatic';
export default {
    data() {
        return {
            options: {},
            filetotal: 0,
            fileext: {},
            pageflag: true,
            timer: null
        };
    },
    created() {
        this.initWebSocket();
        // this.getData()
    },
    mounted() {},
    beforeDestroy() {
        // this.clearData()
        // WebSocketService.closeWebSocket();
        WebSocketService.removeListener(this.handleWebSocketMessage);
    },
    methods: {
        initWebSocket() {
            WebSocketService.initWebSocket();
            WebSocketService.addListener(this.handleWebSocketMessage);
        },
        handleWebSocketMessage(data) {
            this.updateOverview(data);
        },
        reconnectWebSocket() {
            WebSocketService.closeWebSocket();
            setTimeout(() => {
                this.initWebSocket();
            }, 3000); // Reconnect after 3 seconds
        },

        updateOverview(data) {
            this.pageflag = true;
            this.filetotal = data.filetotal;
            this.fileext = data.fileext;
            this.$nextTick(() => {
                this.init()
            })
        },

        clearData() {
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
        },

        init() {
            let total = this.filetotal;
            function generateColor(value, maxValue) {
                // 计算颜色深度，0到255之间
                const intensity = Math.floor((value / maxValue) * 255);
                return `rgb(${intensity}, ${intensity}, 255)`; // 生成蓝色调颜色
            }

            let maxValue = Math.max(...Object.values(this.fileext)); // 获取最大文件数量

            let piedata = {
                name: "文件比例总览",
                type: "pie",
                radius: ["42%", "65%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 4,
                    borderColor: "rgba(0,0,0,0)",
                    borderWidth: 2,
                },
                color: Object.values(this.fileext).map(value => generateColor(value, maxValue)),
                data: Object.keys(this.fileext).map((key, index) => ({
                    value: this.fileext[key],
                    name: key,
                    label: {
                        shadowColor: generateColor(this.fileext[key], maxValue), // 使用生成的颜色
                    },
                }))
            };

            this.options = {
                title: {
                    // zlevel: 0,
                    text: ["{value|" + total + "}", "{name|总数}"].join("\n"),
                    top: "center",
                    left: "center",
                    textStyle: {
                        rich: {
                            value: {
                                color: "#ffffff",
                                fontSize: 24,
                                fontWeight: "bold",
                                lineHeight: 20,
                            },
                            name: {
                                color: "#ffffff",
                                lineHeight: 20,
                            },
                        },
                    },
                },
                tooltip: {
                    trigger: "item",
                    backgroundColor: "rgba(0,0,0,.6)",
                    borderColor: "rgba(147, 235, 248, .8)",
                    textStyle: {
                        color: "#FFF",
                    },
                },
                legend: {
                    show: false,
                    top: "5%",
                    left: "center",
                },
                series: [
                    //展示圆点
                    {
                        ...piedata,
                        tooltip: { show: true },
                        label: {
                            formatter: "   {b|{b}}   \n   {c|{c}个}   {per|{d}%}  ",
                            //   position: "outside",
                            rich: {
                                b: {
                                    color: "#fff",
                                    fontSize: 12,
                                    lineHeight: 26,
                                },
                                c: {
                                    color: "#31ABE3",
                                    fontSize: 14,
                                },
                                per: {
                                    color: "#31ABE3",
                                    fontSize: 14,
                                },
                            },
                        },
                        labelLine: {
                            length: 20, // 第一段线 长度
                            length2: 36, // 第二段线 长度
                            show: true,

                        },
                        emphasis: {
                            show: true,
                        },
                    },
                    {
                        ...piedata,
                        tooltip: { show: true },
                        itemStyle: {},
                        label: {
                            backgroundColor: "inherit", //圆点颜色，auto：映射的系列色
                            height: 0,
                            width: 0,
                            lineHeight: 0,
                            borderRadius: 2.5,
                            shadowBlur: 8,
                            shadowColor: "auto",
                            padding: [2.5, -2.5, 2.5, -2.5],
                        },
                        labelLine: {
                            length: 20, // 第一段线 长度
                            length2: 36, // 第二段线 长度
                            show: false,
                        },
                    },
                ],
            };
        },
    },
};
</script>

<style lang='scss' scoped>

</style>