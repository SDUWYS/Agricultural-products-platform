<template>
	<view class="fullScreen">
		<view class="content">
			<view class="top_back">
			</view>
			<view class="head">
				<view class="avatar_container">
					<view class="avatar" :style="`background-image:url(${userInfo.avatarUrl});`" />
				</view>
				<view style="flex: 3;height: 150rpx;">
					<view class="content">
						<view class="nickname">
							{{userInfo.nickName}}
						</view>
						<view class="right">
							<view style="position: relative;height: 50rpx;margin-right: 45rpx;" @click="toMessageList">
								<u-image height="50rpx" width="50rpx" mode="aspectFit"
									src="/static/images/message_me.png">
								</u-image>
								<view v-if="isRead">
									<u-badge :offset="[-8,-8]" :is-dot="true"></u-badge>
								</view>
								<view v-else>
									<u-badge :offset="[-8,-8]" :is-dot="true" :count="0"></u-badge>
								</view>
							</view>

							<u-image @click="gotoSet" height="50rpx" width="50rpx" mode="aspectFit"
								src="/static/images/set.png">
							</u-image>
						</view>
					</view>

				</view>
			</view>
			<view class="cantainer">
				<view class="item">
					<view class="icon">
						<u-image width="64rpx" mode="aspectFit" height="64rpx"
							src="https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/%E9%92%B1%E5%8C%85.png?sign=6c67c0e7ae28c504dbf7d9dab5a934ff&t=1653970375">
						</u-image>
					</view>
					<view class="right">
						<view class="consumer">
							<text style="font-weight: bold;">累计收入: ￥</text>
							<view style="color: red;">
								<Ellipsis :content="totalSale" :width="120" />
							</view>
						</view>
					</view>
				</view>

				<view class="item">
					<view class="icon">
						<u-image width="64rpx" mode="aspectFit" height="64rpx"
							src="https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/%E8%AE%A2%E5%8D%95.png?sign=1322d50c5a637574e1e5f562d0107050&t=1653974604">
						</u-image>
					</view>
					<view class="right_item">
						<view style="position: relative;" v-for="(item,index) in orderList" :key="index"
							@click="gotoOrder(item.url,index)">
							<view class="item_combine">
								<u-image width="50rpx" mode="aspectFit" height="50rpx" :src="item.icon">
								</u-image>
								<view class="text">
									{{item.text}}
								</view>
							</view>
							<u-badge :offset="[-2,20]" :count="item.count"></u-badge>
						</view>
					</view>
				</view>

				<view class="item">
					<view class="icon">
						<u-image width="64rpx" mode="aspectFit" height="64rpx"
							src="https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/%E5%B7%A5%E5%85%B7.png?sign=eeeac7ea99096dc449d42ac6471f18ec&t=1653974631">
						</u-image>
					</view>
					<view class="right_item">
						<view class="item_combine" v-for="(item,index) in toolList" :key="index"
							@click="gotoPage(item)">
							<u-image width="50rpx" mode="aspectFit" height="50rpx" :src="item.icon">
							</u-image>
							<view class="text">
								{{item.text}}
							</view>
							<button v-if="item.concat" open-type="contact"
								style="position: absolute;opacity: 0;width: 85rpx;height: 100rpx;"></button>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-tabbar :list="list" :mid-button="true" :hideTabBar="false"></u-tabbar>

	</view>
</template>

<script lang="ts">
	import {
		ref,
		reactive,
		onMounted
	} from 'vue';
	import request from '@/api/request';
	import navList from '@/pages/Merchants/utils/navList';
	import {
		userStore
	} from '@/stores/user';
	import {
		storeToRefs
	} from 'pinia';
	import {
		commonStore
	} from '@/stores/store';
	import {
		merchantStore
	} from '@/stores/merchant';
	export default {
		setup() {
			const isRead = ref(false);
			const store = commonStore();
			const merchant = merchantStore();
			const user = userStore();
			const {
				userInfo,
				orderMap
			} = storeToRefs(user);
			const {
				shopInfo
			} = storeToRefs(merchant);
			const list = reactive(navList);
			const money = ref(0);
			// 订单菜单
			const orderList = reactive([{
				icon: 'https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/%E5%BE%85%E5%AE%8C%E6%88%90.png?sign=746d960471d02df9efbc111f2ce19e21&t=1653972109',
				text: '待支付',
				url: "/pages/Merchants/OrderCenter/OrderCenter",
				count: 0
			}, {
				icon: 'https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/%E5%BE%85%E6%94%B6%E8%B4%A7.png?sign=e737ce0a901b7541237a98e097478f3b&t=1655528862',
				text: '待发货',
				url: "/pages/Merchants/OrderCenter/OrderCenter",
				count: 0
			}, {
				icon: 'https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/%E8%BF%9B%E8%A1%8C%E4%B8%AD.png?sign=a65bd977bb15616d00af63ac7571e698&t=1653974111',
				text: '待评价',
				url: "/pages/Merchants/OrderCenter/OrderCenter",
				count: 0
			}, {
				icon: 'https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/%E5%B7%B2%E5%AE%8C%E6%88%90.png?sign=c2f487d81efb16d2d9144f6e18eefe96&t=1653974124',
				text: '售后',
				url: "/pages/Merchants/OrderCenter/OrderCenter",
				count: 0
			}]);

			// 工具菜单
			const toolList = reactive([{
					icon: 'https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/subscribed.png?sign=69ec2849d3541c391f876fe03c1a3192&t=1657330082',
					text: '订阅',
					type: 'subscribe',
				},
				{
					icon: 'https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/%E4%BF%AE%E6%94%B9.png?sign=0afab3b5bfb96a3281e33a6699f42262&t=1657330206',
					text: '店铺',
					url: '/pages/Merchants/CreateShop/CreateShop?mode=edit'
				}, {
					icon: 'https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/%E5%9C%B0%E5%9D%80.png?sign=cec3bc5ea67c8dec43c79dabb404e261&t=1653982220',
					text: '打烊',
					url: '/pages/Tourists/Location/Location'
				}, {
					icon: 'https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/%E5%AE%A2%E6%9C%8D.png?sign=e3c73806b4be9918334f5284c48ca9ae&t=1653982332',
					text: '客服',
					concat: true
				}
			]);


			const gotoOrder = (url: string, index: number) => {
				uni.navigateTo({
					url: url + `?index=${index}`
				})
			}
			const gotoPage = async (item) => {
				console.log(item);
				if (item.concat) {
					return;
				}
				if (item.type === 'subscribe') {
					const templeteList = ['Ig-MJxCd_nD9sYiext0EmxdDq0pQIJV2LgwUoZmB5Wg'];
					uni.requestSubscribeMessage({
						tmplIds: templeteList,
						async success(res) {
							console.log(res);
							// 申请订阅成功
							if (res.errMsg === 'requestSubscribeMessage:ok') {
								uni.showLoading({
									title: '订阅中'
								});
								const res = await request('subcribe', {
									type: 'subcribeOrderMessage',
									templateId: templeteList[0]
								});

								console.log(res);

								// 	wx.cloud
								// 		.callFunction({
								// 			name: 'subscribe',
								// 			data: {
								// 				data: item,
								// 				templateId: templeteList[0],
								// 			},
								// 		})
								// 		.then(() => {
								// 			uni.showToast({
								// 				title: '订阅成功',
								// 				icon: 'success',
								// 				duration: 2000,
								// 			});
								// 		})
								// 		.catch(() => {
								// 			uni.showToast({
								// 				title: '订阅失败',
								// 				icon: 'success',
								// 				duration: 2000,
								// 			});
								// 		});
								uni.hideLoading();
							} else {
								uni.showToast({
									icon: 'error',
									title: '订阅失败'
								});
								uni.hideLoading();
							}
						}
					})
				} else {
					uni.navigateTo({
						url: item.url
					})
				}
			};
			//消息列表界面
			const toMessageList = async function() {
				uni.navigateTo({
					url: "../MessageList/MessageList"
				})
			}

			const gotoSet = () => {
				uni.navigateTo({
					url: "/pages/Public/Setting/Setting"
				})
			}

			const totalSale = ref(0);

			/**
			 * 查询商铺收入金额
			 */
			const getShopTotalSale = async () => {
				console.log(shopInfo.value);
				const total = await request('sale', {
					type: 'queryShopTotalSale',
					shopId: shopInfo.value._id
				});
				console.log(total);
				totalSale.value = total.data.totalSale;
			}

			onMounted(() => {});
			return {
				list,
				userInfo,
				orderList,
				toolList,
				money,
				gotoPage,
				gotoOrder,
				orderMap,
				toMessageList,
				gotoSet,
				store,
				isRead,
				totalSale,
				getShopTotalSale
			}
		},
		async onShow() {
			this.isRead = this.store.mNoRead;

			this.orderList.forEach(item => {
				item.count = 0;
			});
			this.orderMap.forEach((value, key) => {
				this.orderList[key - 1].count = value;
			});
			this.getShopTotalSale();
			const res = await request('user', {
				type: 'getMoneyBalance'
			});
			this.money = res.data || 0;
		}
	}
</script>

<style lang="scss" scoped>
	.fullScreen {
		height: 100vh;
		width: 100%;
		background-color: $background-color;
		position: relative;
		font-size: 32rpx;

		.content {
			background-color: $background-color;

			.top_back {
				width: 100%;
				height: 22vh;
				background-image: url('https://636c-cloud1-7giqepei42865a68-1311829757.tcb.qcloud.la/material/myBack.png?sign=27ceb4b354d32c51bbb7b9d3dc28801a&t=1655529238');
				background-size: cover;
				background-repeat: no-repeat;
				position: relative;
				z-index: 0;
			}

			.head {
				display: flex;
				align-items: center;
				justify-content: space-around;
				height: 150rpx;
				z-index: 99;

				.avatar_container {
					flex: 2;
					display: flex;
					justify-content: center;
					z-index: 98;

					.avatar {
						width: 32vw;
						height: 32vw;
						border-radius: 50%;
						border: 15rpx solid white;
						background-size: cover;
						background-repeat: no-repeat;
						overflow: visible;
						z-index: 98;
						transform: translateY(-75rpx);
					}
				}


				.content {
					font-family: SourceHanSansCN-Bold;
					letter-spacing: 0px;
					color: #4A4A4A;
					font-weight: bold;
					font-size: 40rpx;
					line-height: 40rpx;

					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 20rpx;

					.nickname {}

					.right {
						display: flex;
						align-items: center;
						margin-right: 35rpx;
					}
				}
			}


			.cantainer {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding-top: 30rpx;

				.item {
					width: 100%;
					height: 140rpx;
					border-radius: 30rpx;
					background: #EEEEEE;
					box-shadow: 0px 20rpx 30rpx 0px rgba(10, 31, 68, 0.12);
					transform: translateX(120rpx);
					margin-bottom: 60rpx;

					.icon {
						box-sizing: border-box;
						border: 1px solid #77D4A6;
						background: #FFFFFF;
						width: 140rpx;
						height: 140rpx;
						border-radius: 50%;
						float: left;
						transform: translateX(-66rpx);

						display: flex;
						justify-content: center;
						align-items: center;
					}

					.right {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						transform: translateX(-20rpx);
						height: 100%;

						.consumer {
							margin-right: 40rpx;
							display: flex;
							align-items: center;
						}

						.total {
							display: flex;
							align-items: center;
						}
					}

					.right_item {
						display: flex;
						justify-content: flex-start;
						align-items: center;
						height: 100%;
						transform: translateX(-24rpx);

						.item_combine {
							display: flex;
							justify-content: center;
							align-items: center;
							flex-direction: column;
							margin-right: 32rpx;
							width: 90rpx;

							.text {
								margin-top: 10rpx;
								font-family: SourceHanSansCN-ExtraLight;
								font-size: 30rpx;
								letter-spacing: 0rpx;
								color: #000000;
							}
						}
					}
				}
			}
		}

	}
</style>
