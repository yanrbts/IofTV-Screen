<template>
    <ul class="user_Overview flex" v-if="pageflag">
        <li class="user_Overview-item" style="color: #00fdfa">
            <div class="user_Overview_nums allnum">
                <dv-digital-flop :config="config" style="width:100%;height:100%;" />
            </div>
            <p>总加密文件数</p>
        </li>
        <li class="user_Overview-item" style="color: #07f7a8">
            <div class="user_Overview_nums online">
                <dv-digital-flop :config="onlineconfig" style="width:100%;height:100%;" />
            </div>
            <p>用户在线数</p>
        </li>
        <li class="user_Overview-item" style="color: #e3b337">
            <div class="user_Overview_nums offline">
                <dv-digital-flop :config="offlineconfig" style="width:100%;height:100%;" />
            </div>
            <p>累计用户数</p>
        </li>
        <li class="user_Overview-item" style="color: #f5023d">
            <div class="user_Overview_nums laramnum">
                <dv-digital-flop :config="laramnumconfig" style="width:100%;height:100%;" />
            </div>
            <p>告警次数</p>
        </li>
    </ul>
    <Reacquire v-else @click="reconnectWebSocket" line-height="200px">
        重新获取
    </Reacquire>
</template>

<script>
import Vue from 'vue';
import WebSocketService from 'api/ws';

let style = {
    fontSize: 24
};

export default {
    data() {
        return {
            options: {},
            userOverview: {
                alarmNum: 0,
                offlineNum: 0,
                onlineNum: 0,
                totalNum: 0,
            },
            pageflag: true,
            config: {
                number: [100], // 初始值，可以根据实际情况调整
                content: '{nt}',
                style: {
                    ...style,
                    fill: "#00fdfa",
                },
            },
            onlineconfig: {
                number: 0, // 初始值，可以根据实际情况调整
                content: '{nt}',
                style: {
                    ...style,
                    fill: "#07f7a8",
                },
            },
            offlineconfig: {
                number: 0, // 初始值，可以根据实际情况调整
                content: '{nt}',
                style: {
                    ...style,
                    fill: "#e3b337",
                },
            },
            laramnumconfig: {
                number: 0, // 初始值，可以根据实际情况调整
                content: '{nt}',
                style: {
                    ...style,
                    fill: "#f5023d",
                },
            }
        };
    },
    filters: {
        numsFilter(msg) {
            return msg || 0;
        },
    },
    
    created() {
        this.initWebSocket();
    },
    beforeDestroy() {
        WebSocketService.closeWebSocket();
    },
    methods: {
        initWebSocket() {
            WebSocketService.initWebSocket();
            WebSocketService.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("WebSocket data received:", data);
                    this.updateUserOverview(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            WebSocketService.socket.onclose = () => {
                console.log('WebSocket connection closed. Reconnecting...');
                this.reconnectWebSocket();
            };
            WebSocketService.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        },
        reconnectWebSocket() {
            WebSocketService.closeWebSocket();
            setTimeout(() => {
                this.initWebSocket();
            }, 3000); // Reconnect after 3 seconds
        },
        formatNumber(number) {
            if (number >= 10000) {
                return (number / 10000).toFixed(2); // 返回保留两位小数的数值
            }
            return number;
        },
        formatLabel(number, label) {
            if (number >= 10000) {
                return `${(number / 10000).toFixed(2)}w+ ${label}`;
            }
            return label;
        },
        updateUserOverview(data) {
            this.pageflag = true;
            this.userOverview = data;
            this.onlineconfig = {
                ...this.onlineconfig,
                number: [data.today_user_count]
            }
            this.config = {
                ...this.config,
                number: [data.filetotal]
            }
            this.offlineconfig = {
                ...this.offlineconfig,
                number: [data.total_login_count]
            }
            this.$set(this.laramnumconfig, 'number', data.alarmNum);
        }
    },
};
</script>

<style lang='scss' scoped>
.user_Overview {
    li {
        flex: 1;
        p {
            text-align: center;
            height: 16px;
            font-size: 16px;
        }
        .user_Overview_nums {
            width: 100px;
            height: 100px;
            text-align: center;
            line-height: 100px;
            font-size: 22px;
            margin: 50px auto 30px;
            background-size: cover;
            background-position: center center;
            position: relative;
            &::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
            &.bgdonghua::before {
                animation: rotating 14s linear infinite;
            }
        }
        .allnum {
            &::before {
                background-image: url("../../assets/img/left_top_lan.png");
            }
        }
        .online {
            &::before {
                background-image: url("../../assets/img/left_top_lv.png");
            }
        }
        .offline {
            &::before {
                background-image: url("../../assets/img/left_top_huang.png");
            }
        }
        .laramnum {
            &::before {
                background-image: url("../../assets/img/left_top_hong.png");
            }
        }
    }
}
</style>
