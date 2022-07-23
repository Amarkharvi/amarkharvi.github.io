
function addDarkmodeWidget(){
  new Darkmode().showWidget();
}
window.addEventListener('load',addDarkmodeWidget);

function changeProfile(){
  console.log($('#profileContainer').hasClass('right-panel-active'));
  if($('#profileContainer').hasClass('right-panel-active')){
    profileContainer.classList.remove("right-panel-active");
  }else{
    profileContainer.classList.add("right-panel-active");
  }
  
    // if($('body').hasClass('darkmode--activated')==false){
    //   let isOpen=slider.hasClass('slide-in');
    //   slider.addClass(isOpen ? 'slide-out' : 'slide-in');
    //   $('#amarlight').attr('hidden',false);
    //   $('#amardark').attr('hidden',true);
    // }else{
    //   $('#amarlight').attr('hidden',true);
    //   $('#amardark').attr('hidden',false);
    // }
  }
