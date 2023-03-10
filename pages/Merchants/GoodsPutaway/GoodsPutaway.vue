<template>
	<view class="fullScreen">
		<Nav title="商品上架" :isBack="true" />
		<view class="content">
			<u-form :model="form" ref="formRef" :label-width="150">
				<u-form-item label="商品名称" prop="goodName">
					<u-input v-model="form.goodName" placeholder="(必填)请输入商品名称" />
				</u-form-item>
				<u-form-item label="单价" prop="goodPrice">
					<u-input type="digit" placeholder="(必填)请输入单价" v-model="form.goodPrice" />
				</u-form-item>
				<u-form-item label="单位" prop="unit">
					<u-input v-model="form.unit" placeholder="(必填)请输入单位,如斤" />
				</u-form-item>
				<u-form-item label="展示图片" prop="imageShowList">
					<u-upload @on-choose-complete="chooseComplete" @on-remove="removeImg" :auto-upload="false"
						:max-size="5 * 1024 * 1024" max-count="6" uploadText="(必填)上传"></u-upload>
				</u-form-item>
				<u-form-item label="描述" prop="description">
					<u-input type="textarea" auto-height v-model="form.description" />
				</u-form-item>
				<u-form-item label="配送模式" prop="mode">
					<u-radio-group v-model="form.mode" active-color="#19be6b">
						<u-radio v-for="(item, index) in modeRadioList" :key="index" :name="item.value"
							:disabled="item.disabled">
							{{ item.name }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="类别" prop="firstCategoryId">
					<view style="display: flex;align-items: center;justify-content: space-between;">
						<u-input placeholder="(必选)第一类别" type="select" v-model="selectFirstCategoryVal"
							@click="firstCategoryListShow = true" />
						<u-select v-model="firstCategoryListShow" :list="firstCategoryList"
							@confirm="selectFirstCategory">
						</u-select>
						<view style="margin-left: 15px;margin-right: 15px;">
							—
						</view>
						<u-input placeholder="第二类别" type="select" v-model="selectSecondCategoryVal"
							@click="secondCategoryListShow = true" />
						<u-select v-model="secondCategoryListShow" :list="secondCategoryList"
							@confirm="selectSecondCategory">
						</u-select>
					</view>
				</u-form-item>
				<u-form-item label="位置" prop="location">
					<u-input v-model="locationVal" placeholder="(必填)请选择位置" type="select" @click="chooseLocation" />
				</u-form-item>
				<u-form-item label="产地" prop="originPlace">
					<u-input v-model="form.originPlace" placeholder="(必填)请输入产地,如山东济南" />
				</u-form-item>
				<u-form-item label="规格" prop="specification">
					<u-input v-model="form.specification" placeholder="(必填)请输入规格,如350g一个" />
				</u-form-item>
				<u-form-item label="有效期" prop="expirationDate">
					<u-input type="number" placeholder="(必填)请输入有效天数(天)" v-model="form.expirationDate" />
				</u-form-item>
			</u-form>
			<view class="top_action">
				<u-button type="primary" :loading="submitLoading" @click="submitGood">发布</u-button>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import {
		ref,
		reactive,
		computed,
		onMounted
	} from 'vue';
	import request from '@/api/request';

	import getUUID from '@/utils/getUUID';

	export default {
		setup() {	
			const form = reactive({
				goodName: '',
				goodPrice: NaN,
				unit: '',
				imageShowList: [],
				originPlace: '',
				specification: '',
				expirationDate: '',
				mode: 1,
				firstCategoryId: '',
				secondCategoryId: '',
				location: [],
				adcode: '',
				description: ''
			});
			let formRef = ref(null);

			const firstCategoryList = reactive([]);
			const secondCategoryList = reactive([]);
			const firstCategoryListShow = ref(false);
			const secondCategoryListShow = ref(false);

			const submitLoading = ref(false);

			const rules = ref({
				goodName: [{
					required: true,
					message: '请输入商品名',
					trigger: 'blur',
				}],
				goodPrice: [{
					required: true,
					message: '请输入价格',
					trigger: 'blur'
				}],
				unit: [{
					required: true,
					message: '请输入单位，比如斤',
					trigger: 'blur',
				}],
				imageShowList: [{
					validator: (rule, value, callback) => {
						return value && value.length != 0;
					},
					message: '请至少上传一张产品图片',
					trigger: ['blur', 'change'],
				}],
				originPlace: [{
					required: true,
					message: '请输入商品的产地',
					trigger: 'blur',
				}],
				specification: [{
					required: true,
					message: '请输入商品的规格，如350g',
					trigger: 'blur',
				}],
				expirationDate: [{
					required: true,
					message: '请输入商品的有效期，如6天',
					trigger: 'blur',
				}],
				firstCategoryId: [{
					required: true,
					message: '请输入商品的类别',
					trigger: ['blur', 'change'],
				}],
				location: [{
					validator: (rule, value, callback) => {
						return value && value.length != 0;
					},
					message: '请选择商品的位置',
					trigger: ['blur', 'change'],
				}],
			})

			/**
			 * 选中第一个类别
			 */
			const selectFirstCategory = async (e: Array < {
				value: string;
				label: string;
			} > ) => {
				if (e.length > 0) {
					form.firstCategoryId = e[0].value;
					const res = await request('goods', {
						type: 'getSeondCategory',
						parentId: e[0].value
					});
					// 更新第二类别列表
					secondCategoryList.length = 0;
					res.data.forEach(item => {
						secondCategoryList.push({
							value: item['_id'],
							label: item.name
						})
					});
				}
			}
			/**
			 * 第一个选中展示的值
			 */
			const selectFirstCategoryVal = computed(() => {
				const index = firstCategoryList.findIndex(item => item.value == form.firstCategoryId);
				if (index == -1) {
					return form.firstCategoryId;
				}
				return firstCategoryList[index].label || "";
			})

			/**
			 * 第二个类别
			 */
			const selectSecondCategory = (e: Array < {
				value: string;
				label: string;
			} > ) => {
				if (e.length > 0) {
					form.secondCategoryId = e[0].value;
				}
			}

			/**
			 * 第二个类别选中的展示值
			 */
			const selectSecondCategoryVal = computed(() => {
				const index = secondCategoryList.findIndex(item => item.value == form.secondCategoryId);
				if (index == -1) {
					return form.secondCategoryId;
				}
				return secondCategoryList[index].label || "";
			})

			/**
			 * 配送模式列表
			 */
			const modeRadioList = reactive([{
					name: '自提',
					value: 0
				},
				{
					name: '配送',
					value: 1
				},
			])

			/**
			 * 当选择的图片发生改变时
			 */
			const chooseComplete = async (tempFileLists: Array < {
				url: string
			} > ) => {
				form.imageShowList.length = 0;
				tempFileLists.forEach(item => {
					form.imageShowList.push(item.url);
				})
			}
			/**
			 * 移出图片
			 */
			const removeImg = async (index, lists) => {
				form.imageShowList.splice(index, 1);
			}

			const locationVal = ref('');

			/**
			 * 选择位置
			 */
			const chooseLocation = async () => {
				const {
					latitude,
					longitude
				} = await wx.getLocation({
					type: 'gcj02'
				});
				const res = await wx.chooseLocation({
					latitude: latitude,
					longitude: longitude,
				})
				form.location.length = 0;
				form.location.push(res.longitude);
				form.location.push(res.latitude);
				locationVal.value = res.name;
				const ans = await wx.serviceMarket.invokeService({
					service: 'wxc1c68623b7bdea7b',
					api: 'rgeoc',
					data: {
						"location": res.latitude + "," + res.longitude
					},
				})
				form.adcode = ans.data.result.ad_info.adcode;
			}

			/**
			 * 发布商品
			 */
			const submitGood = async () => {
				submitLoading.value = true;
				await formRef.value.validate(async (valid) => {
					if (valid) {
						const fileList = await Promise.all(form.imageShowList.map(item => {
							return wx.cloud.uploadFile({
								cloudPath: 'goodShowImg/' + new Date().getTime() +
									getUUID() + '.jpg',
								filePath: item,
							})
						}));
						form.imageShowList.length = 0;
						fileList.forEach(item => {
							form.imageShowList.push(item.fileID);
						});
						const res = await request('goods', {
							type: 'addGood',
							form,
						});
						submitLoading.value = false;
						await wx.showToast({
							title: '上架成功',
							duration: 1000
						});
						setTimeout(() => {
							uni.navigateBack();
						}, 1000);
					} else {
						submitLoading.value = false;
					}
				})
			}

			onMounted(async () => {
				const res = await request("goods", {
					type: 'getFirstCategory'
				});
				res.data.forEach(item => {
					firstCategoryList.push({
						value: item['_id'],
						label: item.name
					})
				})
			});
			return {
				form,
				formRef,
				chooseComplete,
				submitGood,
				removeImg,
				modeRadioList,
				firstCategoryList,
				secondCategoryList,
				firstCategoryListShow,
				secondCategoryListShow,
				selectFirstCategory,
				selectFirstCategoryVal,
				selectSecondCategory,
				selectSecondCategoryVal,
				rules,
				submitLoading,
				chooseLocation,
				locationVal
			}
		},
		async onReady() {
			// 设置检查规则
			this.formRef.setRules(this.rules);
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
			position: relative;
			display: flex;
			flex-direction: column;
			padding: 30rpx;
		}
	}
</style>
