<!--
 * @Author: daidai
 * @Date: 2022-03-01 15:27:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-07 11:24:14
 * @FilePath: \web-pc\src\pages\big-screen\view\indexs\right-center.vue
-->
<template>
    <div v-if="pageflag" class="right_center_wrap beautify-scroll-def" :class="{ 'overflow-y-auto': !sbtxSwiperFlag }">
        <component :is="components" :data="list" :class-option="defaultOption">
            <ul class="right_center ">
                <li class="right_center_item" v-for="(item, i) in list" :key="i">
                    <span class="orderNum">{{ i + 1 }}</span>
                    <div class="inner_right">
                        <div class="dibu"></div>
                        <div class="flex">
                            <div class="info">
                                <span class="labels ">设备ID：</span>
                                <span class="contents zhuyao doudong wangguan"> {{ item.machine }}</span>
                            </div>
                            <div class="info">
                                <span class="labels">文件ID：</span>
                                <span class="contents doudong wangguan"> {{ item.fileuuid }}</span>
                            </div>
                            <div class="info">
                                <span class="labels">文件名：</span>
                                <span class="contents warning doudong wangguan"> {{ item.filename }}</span>
                            </div>
                        </div>
    
    
                        <div class="flex">
    
                            <div class="info">
                                <span class="labels"> 用户名：</span>
                                <span class="contents ciyao" style="font-size:12px"> {{ item.username }}</span>
                            </div>
                            <div class="info time">
                                <span class="labels">时间：</span>
                                <span class="contents" style="font-size:12px"> {{ item.time }}</span>
                            </div>
    
                        </div>
                        <div class="flex">
    
                            <div class="info">
                                <span class="labels">操作动作：</span>
                                <span class="contents ciyao" :class="{ warning: item.action }"> 
                                    {{ getActionText(item.action) }}</span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </component>
    </div>
    <Reacquire v-else @onclick="getData" style="line-height:200px" />
</template>
  
<script>
import WebSocketService from 'api/ws';
// import { currentGET } from 'api/modules'
import vueSeamlessScroll from 'vue-seamless-scroll' // vue2引入方式
import Kong from '../../components/kong.vue'
export default {
    components: { vueSeamlessScroll, Kong },

    data() {
        return {
            list: [],
            pageflag: true,
            defaultOption: {
                ...this.$store.state.setting.defaultOption,
                limitMoveNum: 3,
                singleHeight: 250,
                step: 0,
            }

        };
    },
    computed: {
        sbtxSwiperFlag() {
            let ssyjSwiper = this.$store.state.setting.ssyjSwiper
            if (ssyjSwiper) {
                this.components = vueSeamlessScroll
            } else {
                this.components = Kong
            }
            return ssyjSwiper
        }
    },
    created() {
        this.initWebSocket();
    },

    mounted() {
        // this.initWebSocket();
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
            if (Array.isArray(data.last_traces)) {
                // Ensure reactivity by creating a new array
                this.list = data.last_traces.map(item => JSON.parse(item));
            } else {
                console.error("Invalid data format:", data);
            }
            let timer = setTimeout(() => {
                clearTimeout(timer)
                this.defaultOption.step = this.$store.state.setting.defaultOption.step
            }, this.$store.state.setting.defaultOption.waitTime);
        },
        getActionText(action) {
            if (action === 2) {
                return '授权';
            } else if (action === 1) {
                return '申请';
            } else {
                return '未知';
            }
        },
    },
};
</script>

<style lang='scss' scoped>
.doudong {
    //  vertical-align:middle;
    overflow: hidden;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    backface-visibility: hidden;
}

.right_center {
    width: 100%;
    height: 100%;
    .right_center_item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: auto;
        padding: 10px;
        font-size: 14px;
        color: #fff;
        .orderNum {
            margin: 0 20px 0 -20px;
        }
        .inner_right {
            position: relative;
            height: 100%;
            width: 400px;
            flex-shrink: 0;
            line-height: 1.5;
            .dibu {
                position: absolute;
                height: 2px;
                width: 104%;
                background-image: url("../../assets/img/zuo_xuxian.png");
                bottom: -12px;
                left: -2%;
                background-size: cover;
            }
        }
        .wangguan {
            color: #1890ff;
            font-weight: 900;
            font-size: 15px;
            width: 80px;
            flex-shrink: 0;
        }

        .info {
            margin-right: 10px;
            display: flex;
            align-items: center;
            .labels {
                flex-shrink: 0;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
            }
            .zhuyao {
                color: $primary-color;
                font-size: 15px;
            }
            .ciyao {
                color: rgba(255, 255, 255, 0.8);
            }
            .warning {
                color: #E6A23C;
                font-size: 15px;
            }
        }
    }
}

.right_center_wrap {
    overflow: hidden;
    width: 100%;
    height: 250px;
}

.overflow-y-auto {
    overflow-y: auto;
}
</style>