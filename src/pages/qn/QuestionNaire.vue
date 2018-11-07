<template>
	<div class="questionnaire">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size='mini' @click='toAddQuestionnaire'>添加</el-button>
			<el-button size='mini' @click='batchDeleteQuestionnaires'>批量删除</el-button>
		</div>
		<!-- 按钮结束 -->
		<!-- 表格 -->
		<div v-loading='loading'>
			<el-table :border='true' size='mini' :data="questionnaires" style="width: 100%" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" fixed></el-table-column>
	      <el-table-column prop="name" label="问卷名称" width="400" ></el-table-column>
	      <el-table-column prop="description" label="问卷描述"  ></el-table-column>
	      <el-table-column label="操作" width='90' fixed="right" align='center'>
	      	<template slot-scope='{row}'>
	      		<i class="fa fa-eye" title='预览'></i>
	      		<i class="fa fa-trash" title='删除' @click='deleteQuestionnaire(row.id)'></i>
	      		<i class="fa fa-pencil" title='修改' @click='toUpdateQuestionnaire(row)'></i>
	      	</template>
	      </el-table-column>
	    </el-table>
		</div>
		<!-- 表格结束 -->
		<!-- 模态框 -->
		<el-dialog fullscreen :title="questionnaireDialog.title" :visible.sync="questionnaireDialog.visible">
		<!-- 	{{choosedQuestions}} <br>	
			{{questionnaireDialog.form}} <br>
			{{questionnaires}} -->
		  <el-form ref="questionnaireForm" :rules='rules' :model="questionnaireDialog.form" label-position='left' size='small'>
		    <el-form-item label="问卷名称" label-width="100px" prop="name">
		      <el-input v-model="questionnaireDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
				<el-form-item label="问卷简介" label-width="100px" prop="description">
		      <el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="questionnaireDialog.form.description">
					</el-input>
		    </el-form-item>

		    <el-form-item label="问卷题目" label-width="100px">
		      <el-button size='mini' @click="toChooseQuestion">点击选择</el-button>
		    </el-form-item>
		  </el-form>
		  <ul class="question-list" v-loading='loading'>
				<!-- 问题 -->
				<li class="question" v-for='(q,$index) in choosedQuestions'>
					<div class="question-title">
						<span>{{$index+1}}、&nbsp;</span>
						{{q.name}}
						<el-tag type="warning" size='mini'>{{q.questionType}}</el-tag>
					</div>
					<div class="question-options">
						<ol>
							<li v-for='o in q.options'>
								<span>{{o.label}}:</span>
								<span>{{o.name}}</span>
							</li>
						</ol>
					</div>
					<div class="question-btns">
						<i class="fa fa-trash" @click='removeQuestion(q)'></i>
					</div>
				</li>
				<!-- 问题结束 -->
			</ul>

		  <!-- 内层模态框 -->
		  <el-dialog
	      width="50%"
	      title="选择题目"
	      :visible.sync="innerDialog.visible"
	      append-to-body>

	      <ul class="choose-question-list">
	      	<li v-for='q in questions'>
	      		<el-checkbox v-model='choosedQuestions' :label='q'>{{q.name}}</el-checkbox>
	      	</li>
	      </ul>
	      <div slot="footer" class="dialog-footer">
			    <el-button size='mini' type="primary" @click='completeChoose'>确 定</el-button>
			  </div>
	    </el-dialog>
	    <!-- 内层模态框结束 -->
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeQuestionnaireDialog'>取 消</el-button>
		    <el-button size='mini' type="primary" @click='saveOrUpdateQuestionnaire'>确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 模态框结束 -->
		
		

	</div>
</template>
<script>
	import getAxios from '@/http/getAxios'
	let axios = getAxios();
	export default {
		data(){
			return {
				loading:false,
				questionnaires:[],
				questions:[],
				choosedQuestions:[],
				rules:{
					name:[{
						required: true, 
						message: '请输入栏目名称',
						trigger: 'blur' 
					}],
					description:[{
						required: true, 
						message: '请输入介绍信息',
						trigger: 'blur' 
					}]
				},
				multipleSelection:[],
				questionnaireDialog:{
					title:'',
					visible:false,
					form:{}
				},
				innerDialog:{
					visible:false
				}
			}
		},
		created(){
			this.findAllQuestionnaires();
			this.findAllQuestions();
		},
		methods:{
			removeQuestion(question){
				_.remove(this.choosedQuestions,item=>item== question);
				this.choosedQuestions.push({});
				this.choosedQuestions.pop();
			},
			toChooseQuestion(){
				this.innerDialog.visible = true;
			},
			completeChoose(){
				this.innerDialog.visible = false;
			},
			findAllQuestionnaires(){
				this.loading = true;
				axios.get('/questionnaire/findAllQuestionnaire')
				.then(({data:result})=>{
					this.questionnaires = result.data;
				})
				.finally(()=>{
					this.loading = false;
				});
			},
			toAddQuestionnaire(){
				this.questionnaireDialog.title = '添加问卷';
				this.choosedQuestions = [];
				this.questionnaireDialog.form = [];
				this.questionnaireDialog.visible = true;
			},
			closeQuestionnaireDialog(){
				// this.$refs.questionnaireForm.resetFields();
				this.questionnaireDialog.visible = false;
				this.questionnaireDialog.form = {};
				this.choosedQuestions = [];
			},
			saveOrUpdateQuestionnaire(){
				this.$refs.questionnaireForm.validate((valid)=>{
					if(valid){
						// 设置关联的题目
						let ids = this.choosedQuestions.map(item=>item.id);
						this.questionnaireDialog.form.questionIds = ids;

						axios.post('/questionnaire/saveOrUpdateQuestionnaire',this.questionnaireDialog.form)
						.then(({data:result})=>{
							this.findAllQuestionnaires();
							this.closeQuestionnaireDialog();
							this.$notify.success({title:'成功',message:result.message})
						})
						.catch(()=>{
							this.$notify.error({title:'错误',message:'服务器异常'})
						})		
					}
				});
			},
			toUpdateQuestionnaire(row){
				this.questionnaireDialog.title = '修改问卷';
				axios.get('/questionnaire/findQuestionnaireVMById?id='+row.id)
				.then(({data:result})=>{
					this.choosedQuestions = result.data.questionVMs;
					this.questionnaireDialog.form = row;
					this.questionnaireDialog.visible = true;
				})
				.catch(()=>{
					this.$notify.error({
						title:'错误',
						message:"服务器异常"
					})
				})
			},
			batchDeleteQuestionnaires(){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	let ids = this.multipleSelection.map((item)=>{
						return item.id;
					})
					axios.post('/questionnaire/batchDeleteQuestion',{ids})
					.then(({data:result})=>{
						this.findAllQuestionnaires();
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
			deleteQuestionnaire(id){
				this.$confirm('此操作将永久删除该数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
        	axios.get('/questionnaire/deleteQuestionnaireById?id='+id)
					.then(({data:result})=>{
						this.findAllQuestionnaires();
						this.$notify.success({title:'成功',message:result.message})
					})
					.catch(()=>{
						this.$notify.error({title:'错误',message:'服务器异常'})
					})
        })
			},
			findAllQuestions(){
				this.loading = true;
				axios.get('/question/findAllQuestionVM')
				.then(({data:result})=>{
					this.questions = result.data;
				})
				.catch(()=>{
					this.$notify.error({
						title:'错误',
						message:'服务器异常'
					})
				})
				.finally(()=>{
					this.loading = false;
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
	.question-list {
 		border-top: 1px solid #ededed;
 	}
	.question {
		padding: .5em 2em;
		border-bottom: 1px solid #ededed;
		position: relative;
	}
	.question > .question-title {
		line-height: 2.5em;
		color: #333;
	}
	.question > .question-options {
		padding-left: 2em;
	}
	.question > .question-options li{
		line-height: 2em;
	}
	.question > .question-btns {
		position: absolute;
		top: .5em;
		right: 2em;
	}
	.choose-question-list > li {
		line-height: 2em;
	}
</style>