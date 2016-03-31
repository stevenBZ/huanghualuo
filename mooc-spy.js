var http = require('http');
var cheerio = require('cheerio');
var url = "http://www.imooc.com/learn/348";

function filterChapters(html) {
  //把html内容封装进$中，
  var $ = cheerio.load(html);
  //分析出包含所有章节的类名
  var chapters = $('.chapter');
    var courseData = [];   //课程信息
    //把each中要定义的变量移动到函数顶部，避免反复声明
    var chapter;
    var chapterTitle;
    var videos;
    var chapterData;
    var video;
    var videoTitle;
    var id;
    var adress;

    chapters.each(function(index, item) {
      chapter = $(item);
      chapterTitle = chapter.find('strong').text();
      videos = chapter.find('li');
      chapterData = {
        'chapterTitle': chapterTitle,
        'videos': []
      };
      videos.each(function(index, item) {
        video = $(item).find('.J-media-item');
        videoTitle = video.text();
        id = video.attr('href').split('video/')[1];
        adress = video.attr('href');

        chapterData.videos.push({
          'title':videoTitle,
          'id':id,
          'adress':adress
        });
      });
      courseData.push(chapterData);
    });
    return courseData;
}

function printCourseInfo(courseData) {
    var chapterTitle;
    var urlPre = 'URL:http://www.imooc.com';
    courseData.forEach(function(item) {
      chapterTitle = item.chapterTitle;
      console.log(chapterTitle + ':' + '\n');
      item.videos.forEach(function(video) {
        console.log('ID:【' + video.id + '】' + urlPre + video.adress +'  章节：'+ video.title.trim() + '\n');
      });
    });
}
http.get(url, function(res) {
  var html = '';
  res.on('data', function(data) {
    html += data;
  });

  res.on('end', function() {
    var courseData = filterChapters(html);
    printCourseInfo(courseData);
  });
}).on('error', function() {
  console.log("获取课程数据出错！");
});
