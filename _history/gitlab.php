<?php
// 2018-3-27 09:04:05
error_reporting(1);
$jsonString = file_get_contents('php://input');
$jsonObj = json_decode($jsonString, true);

// 项目域名=>也就是所谓的部署目录名称
$gDomain = isset($_GET["domain"]) ? $_GET["domain"] : "empty";
if($gDomain == ""){
	$gDomain = "empty";
}
// 提取本次提交的分支名称
$gBranch = str_replace("refs/heads/","",$jsonObj["ref"]);

// 提取项目默认分支名称=>也就是在gitlab上设置的默认分支名
$gDefault_branch = $jsonObj["project"]["default_branch"];

// 将最后一次获得到的提交信息写入到日志
file_put_contents("log-".$gDomain.".php","<pre>".$jsonString."</pre>");

// 如果本次提交名称和预设分支一直，进行部署
if($gDomain != "empty" && $gBranch == $_GET["branch"]){
	shell_exec("cd /code/gitlab/".$gDomain." && git fetch -p && git checkout -f ".$jsonObj["after"]);
}

// demo
// http://deploy.xxx.xxx/gitlab.php?domain=fe1.xxx.xxx&branch=develop