<template>
	<div class="ques">
		<!-- 按钮 -->
		<div class="btns">
			<el-button size='mini' @click='toAddQuestion'>添加</el-button>
			<el-button size='mini'>批量删除</el-button>
		</div>
		<!-- 按钮结束 -->
		<!-- 内容区 -->
		<div class="question-content" v-loading='loading'>
			<ul>
				<li class="question" v-for='q in questions'>
					<div class="question-title">
						 <el-checkbox v-model='ids' :label='q.id'></el-checkbox>
						 {{q.name}} 
							<el-tag type="success" size='small'>{{q.questionType}}</el-tag>

					</div>
					<div class="question-options" v-if='q.questionType!="简答题"'>
						<ol>
							<li v-for='o in q.options'>
								<span>{{o.label}}:</span>
								<span>{{o.name}}</span>
							</li>
						</ol>					
					</div>
					<div class="question-btns">
						<i class="fa fa-trash"></i>
						<i class="fa fa-pencil"></i>
					</div>
				</li>
			</ul>
		</div>
		<!-- 内容区结束 -->
		<!-- 模态框 -->
		<el-dialog :title="questionDialog.title" :visible.sync="questionDialog.visible" width="80%">
			{{questionDialog.form}}
		  <el-form ref="questionForm" :rules='rules' :model="questionDialog.form" label-position='left' size='small'>
		    <el-form-item label="题目名称" label-width="100px" prop="name">
		       <el-input type="textarea" :rows="2" placeholder="请输入题目名称" v-model="questionDialog.form.name"></el-input>
		    </el-form-item>
				<el-form-item label="题目类型" label-width="100px" prop="descriptioin">
		    	<el-select v-model='questionDialog.form.questionType' placeholder=''>
		    		<el-option label='单选题' value='单选题'></el-option>
		    		<el-option label='多选题' value='多选题'></el-option>
		    		<el-option label='简答题' value='简答题'></el-option>
		    	</el-select>
		    </el-form-item>
		    <el-form-item label="题目选项" label-width="100px" >
		
		<el-table size='mini' border :data="questionDialog.form.options" style="width: 100%">
      <el-table-column label="序号" width="60"> 
      	<template slot-scope='scope'>
      		{{scope.$index+1}}
      	</template>
      </el-table-column>
      <el-table-column prop="label" label="label" width="60"> 
      </el-table-column>
      <el-table-column label="选项">
      	<template slot-scope='scope'>
      		<el-input size='mini' v-model='scope.row.name'></el-input>
      	</template>
      </el-table-column>
      <el-table-column label="分值" width="60">
      	<template slot-scope='scope'>
      		<el-input size='mini' v-model='scope.row.score'></el-input>
      	</template>
      </el-table-column>
      <el-table-column label="操作" width='60' align='center'>
      	<template slot-scope='scope'>
      		<i class="fa fa-trash" @click='deleteOption(scope.row)'></i>
      	</template>
      </el-table-column>
    </el-table>
    <div style="text-align:right;font-size:1.5em">
    	<el-button size='mini' @click='addOption' :disabled='questionDialog.form.options.length>=5'>
    		<i class="fa fa-plus"></i>
    	</el-button>
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
	// import axiosArray from '@/http/axiosArray'
	import getAxios from '@/http/getAxios'
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
			deleteOption(row){
				_.remove(this.questionDialog.form.options,(item)=>{
					return item == row;
				})
				this.questionDialog.form.options.push({});
				this.questionDialog.form.options.pop();
			},
			addOption(){
				let option = {
					name:''
				};
				let label = '';
				let score = 0;
				switch(this.questionDialog.form.options.length){
					case 0:
						label = 'A';
						score = 5;
						break;
					case 1:
						label = 'B';
						score = 4;
						break;
					case 2:
						label = 'C';
						score = 3;
						break;
					case 3:
						label = 'D';
						score = 2;
						break;
					case 4:
						label = 'E';
						score = 1;
						break;
				}
				option.label = label ;
				option.score = score ;
				this.questionDialog.form.options.push(option);
			},
			toAddQuestion(){
				this.questionDialog.title = '添加问题';
				this.questionDialog.visible = true;
			},
			saveOrUpdateQuestion(){
				axios.post('/question/saveOrUpdateQuestion',this.questionDialog.form)
				.then(({data:result})=>{
					this.$notify.success({
						title:'成功',
						message:result.message
					})
					this.closeQuestionDialog();
					this.findAllQuestions();
				})
				.catch(()=>{
					this.$notify.error({
						title:'失败',
						message:'服务器异常'
					})
				})
			},
			closeQuestionDialog(){
				this.questionDialog.visible = false;
				this.questionDialog.form = {
					options:[]
				};
			},
			findAllQuestions(){
				this.loading = true;
				axios.get('/question/findAllQuestionVM')
				.then(({data:result})=>{
					this.questions = result.data;
				})
				.catch(()=>{
					this.$notify.error({
						title:"错误",
						message:"服务器异常"
					})
				})
				.finally(()=>{
					this.loading = false;
				});
			}
		}
	}
</script>
<style>
	.question {
		border-bottom: 1px solid #ededed;
		padding: .5em 0;
		position: relative;
	}
	.question > .question-title {
		line-height: 2em;
		color:#333;
	}
	.question > .question-options {
		padding: 0 2em;
	}
	.question > .question-options li {
		line-height: 2em;
	}
	.question > .question-btns {
		position: absolute;
		right: 1em;
		top: .5em;
	}
	i.fa {
		cursor: pointer;
		padding: 0 .3em;
	}
	i.fa.fa-trash {
		color: #F56C6C
	}






</style>