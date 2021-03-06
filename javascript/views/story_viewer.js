
function storyViewInit(){

  if(Story.instance.title){
      $("#export-title").val(Story.instance.metadata.title);
  }

  if(Story.instance.author){
      $("#export-author").val(Story.instance.metadata.author);
  }

  $("#story-sections")
    .empty()
    .append(createAddSectionButton());

  Story.instance.blocks.forEach(function(block){
    $("#story-sections")
      .append(newSection(block.renderToAuthor()))
      .append(createAddSectionButton());
  });
}

onPageEnter["story"] = storyViewInit;


function storyViewLeave(){

  Story.instance.metadata.title = $("#export-title").val();
  Story.instance.metadata.author = $("#export-author").val();

  Story.instance.blocks = [];
  $(".story-block").each(function(){

    var storyBlock;
    var block = $(this).find('div');
    
    if(block.hasClass("text-block")){
      storyBlock = new TextBlock(block.find('textarea').val());
    }
    else if(block.hasClass("chart-block")){
      storyBlock = new ChartBlock(block.html());
    }
    else if(block.hasClass("image-block")){
      storyBlock = new ImageBlock(block.find('.image-caption').val(), $(this).find('.image-url').val());
    }
    else if(block.hasClass("data-block")){
      storyBlock = new DataBlock(block.html());
    }

    if(storyBlock){
      Story.instance.blocks.push(storyBlock);
    }
  });
}

onPageLeave["story"] = storyViewLeave;


function newSection(blockContent){

  var block = $('<div class="story-block">');

  if(!blockContent){
    block.append($('<button class="btn btn-sm btn-danger trash-button"><i class="fas fa-trash-alt"></i></button>').click(function(){
      $(this).parent().after(createAddSectionButton());
      $(this).parent().remove();
    }));

    block
      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-file-alt"></i> Recommend</button>')
        .click(function(){
          //TODO: Replace this with a proper rule-based dynamic template system
          var recommendedBlock = storyTemplate.shift();
          var blockClass;
          if(recommendedBlock instanceof TextBlock){
            blockClass = "text-block";
          }
          else if(recommendedBlock instanceof ImageBlock){
            blockClass = "image-block";
          }
          else if(recommendedBlock instanceof ChartBlock){
            blockClass = "chart-block";
          }
          if(recommendedBlock instanceof DataBlock){
            blockClass = "data-block";
          }
          $(this).parent().parent().addClass(blockClass);
          insertEmptySection($(this).parent(), newSection(recommendedBlock.renderToAuthor()));
        })
        //Disable the button if there's nothing in the recommender queue
        //TODO: replace the queue with a rule based system that takes into account previous and subsequent StoryBlocks
        .prop('disabled', storyTemplate.length == 0)
      )

      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-file-alt"></i> Text</button>')
        .click(function(){
          $(this).parent().parent().addClass('text-block');
          insertEmptySection($(this).parent(), newSection(new TextBlock().renderToAuthor()));
        })
      )

      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-image"></i> Image</button>')
        .click(function(){
          $(this).parent().addClass('image-block');
          insertEmptySection($(this).parent(), newSection(new ImageBlock().renderToAuthor()));
        })
      )

      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-chart-bar"></i> Chart</button>')
        .click(function(){
          $(this).parent().addClass('chart-block');
          insertEmptySection($(this).parent(), newSection(new ChartBlock().renderToAuthor()));
        })
      )

      .append($('<button class="btn btn-primary btn-story-block"><i class="fas fa-table"></i> Data</button>')
        .click(function(){
          $(this).parent().addClass('data-block');
          insertEmptySection($(this).parent(), newSection(new DataBlock().renderToAuthor()));
        })
        .prop('disabled', true)
      );

  }
  else{
    block.append($('<button class="btn btn-sm btn-danger trash-button"><i class="fas fa-trash-alt"></i></button>').click(function(){
      $(this).parent().next(".btn-add").remove();
      $(this).parent().remove();
    }));
    block.append($(blockContent));
  }

  return block;
}


function insertEmptySection(container, section){
  container
    .after(createAddSectionButton())
    .after(section)
    .after(createAddSectionButton())
    .remove();
}

function createAddSectionButton(){
  return $('<button class="btn btn-primary btn-sm btn-add"><i class="fas fa-plus"></i></button>').click(function(){
    $(this)
      .after(newSection())
      .remove();
  });
}
