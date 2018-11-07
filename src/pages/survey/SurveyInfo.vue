<!-- 课调管理 -->
<template>
	<div class="survey">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size='mini' @click='toAddSurvey'>添加</el-button>
			<el-button size='mini' @click='batchDeleteSurveys'>批量删除</el-button>
		</div>
		<!-- 按钮结束 -->
		<!-- 表格 -->
		<!-- {{surveys}} -->
		<div v-loading='loading'>
			<el-table :border='true' size='mini' :data="surveys" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" fixed></el-table-column>
	      <el-table-column prop="clazzVM.grade.name" label="年级" width="100"></el-table-column>
	      <el-table-column prop="clazzVM.name" label="班级" width="100"></el-table-column>
	      <el-table-column prop="course.name" label="课程" width="100"></el-table-column>
	      <el-table-column prop="user.name" label="讲师" width="80"></el-table-column>
	      <el-table-column prop="qnVM.name" label="问卷" width="300"></el-table-column>
	      <el-table-column prop="surveydate" label="创建时间" width="160"></el-table-column>
	      <el-table-column prop="status" label="状态" width="80" align='center'></el-table-column>
	      <el-table-column label="操作" width='100' fixed="right" align='center'>
	      	<template slot-scope='{row}'>
	      		<i class="fa fa-trash" @click='deleteSurvey(row.id)'></i>
	      		<i class="fa fa-pencil" @click='toUpdateSurvey(row)'></i>
	      		<el-button :disabled='row.status=="开启"' type='text' @click='startSurvey(row)' >
	      			<i class="fa fa-power-off"></i>
	      		</el-button>
	      	</template>
	      </el-table-column>
	    </el-table>
		</div>
		<!-- 表格结束 -->
		<!-- 模态框 -->
		<el-dialog :title="surveyDialog.title" :visible.sync="surveyDialog.visible">
			{{surveyDialog.form}}
		  <el-form ref="surveyForm" :rules='rules' :model="surveyDialog.form" label-position='left' size='small'>
		    <el-form-item label="班级" label-width="80px">
		      <el-select style='width:100%' v-model='surveyDialog.form.clazzId'>
		      	<el-option :key='v.id' :label='v.name' :value='v.id' v-for='v in clazzes'></el-option>
		      </el-select>
		    </el-form-item>
				<el-form-item label="课程" label-width="80px" >
		       <el-select style='width:100%' v-model='surveyDialog.form.courseId'>
		      	<el-option :key='v.id' :label='v.name' :value='v.id' v-for='v in courses'></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="问卷" label-width="80px" >
		      <el-select style='width:100%' v-model='surveyDialog.form.questionnaireId'>
		      	<el-option :key='v.id' :label='v.name' :value='v.id' v-for='v in questionnaires'></el-option>
		      </el-select>
		    </el-form-item>
		    <el-form-item label="讲师" label-width="80px" >
		      <el-select style='width:100%' v-model='surveyDialog.form.userId'>
		      	<el-option :key='v.id' :label='v.name' :value='v.id' v-for='v in users'></el-option>
		      </el-select>
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
				},
				//-----
				clazzes:[],
				courses:[],
				users:[],
				questionnaires:[]
			}
		},
		created(){
			this.findAllSurveys();

			this.findAllClazzes();
			this.findAllCourses();
			this.findAllQuestionnaires();
			this.findAllUsers();
		},
		methods:{
			startSurvey(row){
				axios.get('/survey/beginSurvey?id='+row.id)
				.then(({data:result})=>{
					this.findAllSurveys();
					this.$notify.success({title:'成功',message:result.message})
				})
				.catch(()=>{
					this.$notify.error({title:'错误',message:'服务器异常'})
				})
			},
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
			toUpdateSurvey(row){
				this.surveyDialog.title = '修改课调';
				this.surveyDialog.visible = true;
				let survey = _.clone(row);
				survey.courseId = survey.course.id;
				survey.clazzId = survey.clazzVM.id;
				survey.userId = survey.user.id;
				survey.questionnaireId = survey.qnVM.id;

				delete survey.course;
				delete survey.clazzVM;
				delete survey.user;
				delete survey.qnVM;

				this.surveyDialog.form = survey;
			},
			batchDeleteSurveys(){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	let ids = this.multipleSelection.map((item)=>{
						return item.id;
					})
					axios.post('/survey/batchDeleteSurveyById',{ids})
					.then(({data:result})=>{
						this.findAllSurveys();
						this.$notify.success({title:'成功',message:result.message})
					})
					.catch(()=>{
						this.$notify.error({title:'错误',message:'服务器异常'})
					})
        })
			},
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			deleteSurvey(id){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	axios.get('/survey/deleteSurveyById?id='+id)
					.then(({data:result})=>{
						this.findAllSurveys();
						this.$notify.success({title:'成功',message:result.message})
					})
					.catch(()=>{
						this.$notify.error({title:'错误',message:'服务器异常'})
					})
        })
			},
			//--------
			findAllClazzes(){
				axios.get('/clazz/findAllVM')
				.then(({data:result})=>{
					this.clazzes = result.data;
				})
			},
			findAllCourses(){
				axios.get('/course/findAllCourse')
				.then(({data:result})=>{
					this.courses = result.data;
				})
			},
			findAllUsers(){
				axios.get('/user/findAll')
				.then(({data:result})=>{
					this.users = result.data;
				});
			},
			findAllQuestionnaires(){
				axios.get('/questionnaire/findAllQuestionnaire')
				.then(({data:result})=>{
					this.questionnaires = result.data;
				});
			}
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