<!--
 * @Author: daidai
 * @Date: 2022-03-01 15:51:43
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-29 15:12:46
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\right-bottom.vue
-->
<template>
    <div class="right_bottom">
        <dv-capsule-chart :config="config" style="width:100%;height:260px" />
    </div>
</template>
  
<script>
import WebSocketService from 'api/ws';
export default {
    data() {
        return {
            gatewayno: '',
            config: {
                showValue: true,
                unit: "台",
                data: []
            },

        };
    },
    created() {
        this.initWebSocket()
    },
    computed: {},
    mounted() {
        // this.initWebSocket();
    },
    beforeDestroy() {
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
        updateOverview(data) {
            this.pageflag = true;
            // Convert data.device_list from object to array if necessary
            const deviceList = Object.entries(data.device_list).map(([key, value]) => ({ name: key, value }));
            this.config = {
                ...this.config,
                data: deviceList
            }
        },
    },
};
</script>

<style lang='scss' scoped>
.list_Wrap {
    height: 100%;
    overflow: hidden;
    :deep(.kong) {
        width: auto;
    }
}

.sbtxSwiperclass {
    .img_wrap {
        overflow-x: auto;
    }
}

.right_bottom {
    box-sizing: border-box;
    padding: 0 16px;
    .searchform {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        .searchform_item {
            display: flex;
            justify-content: center;
            align-items: center;
            label {
                margin-right: 10px;
                color: rgba(255, 255, 255, 0.8);
            }
            button {
                margin-left: 30px;
            }
            input {}
        }
    }
    .img_wrap {
        display: flex; // justify-content: space-around;
        box-sizing: border-box;
        padding: 0 0 20px; // overflow-x: auto;
        li {
            width: 105px;
            height: 137px;
            border-radius: 6px;
            overflow: hidden;
            cursor: pointer; // background: #84ccc9;
            // border: 1px solid #ffffff;
            overflow: hidden;
            flex-shrink: 0;
            margin: 0 10px;
            img {
                flex-shrink: 0;
            }
        }
    }
    .noData {
        width: 100%;
        line-height: 100px;
        text-align: center;
        color: rgb(129, 128, 128);
    }
}
</style>