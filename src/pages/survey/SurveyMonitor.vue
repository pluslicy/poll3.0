<!-- 课调管理 -->
<template>
	<div class="survey">
		<!-- 按钮 -->
		<div class="btns">
		</div>
		<!-- 按钮结束 -->
		<!-- 表格 -->
		<div v-loading='loading'>
			<el-table :border='true' size='mini' :data="surveys" style="width: 100%" >
				<el-table-column type="selection" width="55" fixed></el-table-column>
	      <el-table-column prop="clazzVM.grade.name" label="年级" width="100"></el-table-column>
	      <el-table-column prop="clazzVM.name" label="班级" width="100"></el-table-column>
	      <el-table-column prop="course.name" label="课程" width="100"></el-table-column>
	      <el-table-column prop="user.name" label="讲师" width="80"></el-table-column>
	      <el-table-column prop="qnVM.name" label="问卷" width="300"></el-table-column>
	      <el-table-column prop="surveydate" label="创建时间" width="160"></el-table-column>
	      <el-table-column prop="status" label="状态" width="80" align='center'></el-table-column>
	      <el-table-column label="操作" width='70' fixed="right" align='center'>
	      	<template slot-scope='{row}'>
	      		<i class="fa fa-circle-o-notch" @click='deleteSurvey(row.id)'></i>
	      	</template>
	      </el-table-column>
	    </el-table>
		</div>
		<!-- 表格结束 -->
		<!-- 模态框 -->
		<el-dialog :title="surveyDialog.title" :visible.sync="surveyDialog.visible">
			<!-- {{surveyDialog.form}} -->
		  <el-form ref="surveyForm" :rules='rules' :model="surveyDialog.form" label-position='left' size='small'>
		    <el-form-item label="课调名称" label-width="100px" prop="name">
		      <el-input v-model="surveyDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
				<el-form-item label="课调简介" label-width="100px" prop="descriptioin">
		      <el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="surveyDialog.form.descriptioin">
					</el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeSurveyDialog'>取 消</el-button>
		    <el-button size='mini' type="primary" @click='saveOrUpdateSurvey'>确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 按钮结束 -->

	</div>
</template>
<script>
	import getAxios from '@/http/getAxios'
	let axios = getAxios();
	export default {
		data(){
			return {
				loading:false,
				surveys:[],
				rules:{
				},
				multipleSelection:[],
				surveyDialog:{
					title:'',
					visible:false,
					form:{}
				}
			}
		},
		created(){
			this.findAllSurveys();
		},
		methods:{
			findAllSurveys(){
				this.loading = true;
				axios.get('/survey/findAllSurveyVM')
				.then(({data:result})=>{
					this.surveys = result.data;
				})
				.finally(()=>{
					this.loading = false;
				});
			},
			toAddSurvey(){
				this.surveyDialog.title = '添加课调';
				this.surveyDialog.visible = true;
			},
			closeSurveyDialog(){
				this.surveyDialog.visible = false;
				this.surveyDialog.form = {};
				this.$refs.surveyForm.resetFields();
			},
			saveOrUpdateSurvey(){
				this.$refs.surveyForm.validate((valid)=>{
					if(valid){
						axios.post('/survey/saveOrUpdateSurvey',this.surveyDialog.form)
						.then(({data:result})=>{
							this.findAllSurveys();
							this.closeSurveyDialog();
							this.$notify.success({title:'成功',message:result.message})
						})
						.catch(()=>{
							this.$notify.error({title:'错误',message:'服务器异常'})
						})		
					}
				});
			},

		}
	}
</script>
<style>
	.btns {
		margin-bottom: .5em;
	}
	i.fa {
		padding: 0 .3em;
		cursor: pointer;
	}
	i.fa.fa-trash {
		color: #F56C6C;
	}
</style>