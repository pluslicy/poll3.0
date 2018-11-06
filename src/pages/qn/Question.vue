<template>
	<div class="question-content">
		<!-- 按钮组 -->
		<div class="btns">
			<el-button size='mini' @click='toAddQuestion'>添加</el-button>
			<el-button size='mini' @click='batchDeleteQuestion'>批量删除</el-button>
		</div>
		<!-- 按钮组结束 -->
		<!-- 内容 -->
		<!-- {{ids}} -->
		<ul class="question-list" v-loading='loading'>
			<!-- 问题 -->
			<li class="question" v-for='q in questions'>
				<div class="question-title">
					<el-checkbox v-model='ids' :label='q.id'>{{q.name}}</el-checkbox>
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
					<i class="fa fa-trash" @click='deleteQuestion(q.id)'></i>
					<i class="fa fa-pencil" @click='toUpdateQuestion(q)'></i>
				</div>
			</li>
			<!-- 问题结束 -->
		</ul>
		<!-- 内容结束 -->
		<!-- 模态框 -->
		<el-dialog width='80%' :title="questionDialog.title" :visible.sync="questionDialog.visible">
			<!-- {{questionDialog.form}} -->
		  <el-form ref="questionForm" :rules='rules' :model="questionDialog.form" label-position='left' size='small'>
		    <el-form-item label="题目名称" label-width="100px" prop="name">
		       <el-input
						  type="textarea" :rows="2"
						  placeholder="请输入内容"
						  v-model="questionDialog.form.name">
						</el-input>
		    </el-form-item>
				<el-form-item label="题目类型" label-width="100px" prop="descriptioin">
		     	<el-select v-model='questionDialog.form.questionType'>
		     		<el-option label='单选题' value='单选题'></el-option>
		     		<el-option label='多选题' value='多选题'></el-option>
		     		<el-option label='简答题' value='简答题'></el-option>
		     	</el-select>
		    </el-form-item>
		    <el-form-item v-if='questionDialog.form.questionType!="简答题"' label="题目选项" label-width="100px" prop="descriptioin">
		    	<el-table :data='questionDialog.form.options' size='mini' border>
		    		<el-table-column label='编号' width='60' align='center'>
		    			<template slot-scope='{$index,row}'>
		    				{{$index+1}}
		    			</template>
		    		</el-table-column>
		    		<el-table-column prop='label' label='label' width='60' align='center'></el-table-column>
		    		<el-table-column label='选项'>
		    			<template slot-scope='scope'>
		    				<el-input v-model='scope.row.name'></el-input>
		    			</template>
		    		</el-table-column>
		    		<el-table-column label='分值'  width='60' align='center'>
		    			<template slot-scope='scope'>
		    				<el-input v-model='scope.row.score'></el-input>
		    			</template>
		    		</el-table-column>
		    		<el-table-column label='操作'  width='60' align='center'>
		    			<template slot-scope='scope'>
		    				<i class="fa fa-trash"></i>
		    			</template>
		    		</el-table-column>
		    	</el-table>
		    	<div style='text-align:right;'>
		    		<el-button :disabled='questionDialog.form.options.length>=5' size='mini' @click='addOption'><i class="fa fa-plus"></i></el-button>
		    	</div>
		     
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini' @click='closeQuestionDialog'>取 消</el-button>
		    <el-button size='mini' type="primary" @click='saveOrUpdateQuestion'>确 定</el-button>
		  </div>
		</el-dialog>
		<!-- 模态框结束 -->
	</div>
</template>

<script>
	import getAxios from '@/http/getAxios'
	//post提交数据，数据中有数组，并且数组中嵌套对象
	let axios = getAxios('array');
	export default {
		data(){
			return {
				loading:false,
				ids:[],
				questions:[],
				rules:{},
				questionDialog:{
					title:'',
					visible:false,
					form:{
						options:[]
					}
				}
			}
		},
		created(){
			this.findAllQuestions();
		},
		methods:{
			deleteQuestion(id){
				alert(id);
			},
			toUpdateQuestion(row){
				this.questionDialog.title = '修改题目';
				this.questionDialog.visible = true;
				this.questionDialog.form = row;
			},
			addOption(){
				let option = {};
				let label = ''
				let score = 0;
				switch(this.questionDialog.form.options.length){
					case 0:
						label='A'; score = 5;
						break;
					case 1:
						label='B'; score = 4;
						break;
					case 2:
						label='C'; score = 3;
						break;
					case 3:
						label='D'; score = 2;
						break;
					case 4:
						label='E'; score = 1;
						break;
				}
				option.label = label;
				option.score = score;
				this.questionDialog.form.options.push(option);
			},
			saveOrUpdateQuestion(){
				// 处理数据
				if(this.questionDialog.form.id){
					if(this.questionDialog.form.questionType=='简答题'){
						delete this.questionDialog.form.options;
					}
				}
				// 执行更新操作
				axios.post('/question/saveOrUpdateQuestion',this.questionDialog.form)
				.then(({data:result})=>{
					if(result.status == '200'){
						this.$notify.success({title:'成功', message:result.message })
						this.closeQuestionDialog();
						this.findAllQuestions();
					} else {
						this.$notify.error({title:'错误', message:result.message })
					}
				})
				.catch((error)=>{
					this.$notify.error({title:'错误', message:'服务器异常' })
				})
			},
			closeQuestionDialog(){
				this.questionDialog.visible = false;
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
			toAddQuestion(){
				this.questionDialog.title = '添加问题';
				this.questionDialog.visible = true;
				this.questionDialog.form = {
					options:[]
				};
			},
			batchDeleteQuestion(){

			}
		}
	}
</script>

<style>
	.btns {
		margin-bottom: .5em;
	}
 	.question-list {
 		border-top: 1px solid #ededed;
 	}
	.question {
		padding: .5em 0;
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

	i.fa {
		cursor: pointer;
		padding: 0 .3em;
	}
	i.fa.fa-trash {
		color: #F56C6C;
	}
</style>











