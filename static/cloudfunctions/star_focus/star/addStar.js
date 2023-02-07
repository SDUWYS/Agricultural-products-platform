// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext();

	const {
		shareId
	} = event;

	const openid = wxContext.OPENID;

	let res = {};

	const _ = db.command;

	try {
		const starDb = db.collection('star');
		const shareDb = db.collection('share');
		const temp = await Promise.all([starDb.add({
			data: {
				_openid: openid,
				shareId: shareId,
				type: 1, // 1是点赞，0是取消点赞
				createTime: new Date()
			}
		}), shareDb.doc(shareId).update({
			data: {
				star: _.inc(1)
			}
		})]);
		res = {
			sucess: true,
			message: "",
			data: temp,
		}
	} catch (e) {
		console.trace(e);
		res = {
			sucess: false,
			message: "未知异常",
			data: e
		}
	}

	return res;
}
