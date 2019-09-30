
var gitalk = new Gitalk({  
  "clientID": "f405db0bc334c654cb02",  
  "clientSecret": "f1658ea7679789bb0b8f4c38bd46264eade59a9b",  
  "repo": "LuciusCS.github.io",  
  "owner": "LuciusCS",  
  "admin": ["LuciusCS"],  
  "id": location.pathname,        
  "distractionFreeMode": false    
});  
gitalk.render("gitalk-container");  