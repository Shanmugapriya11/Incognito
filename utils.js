    
module.exports = {
    generatingPDF: function(){
        console.log("Am generatingPDF");
        doc = new PDF();                        
        doc.pipe(fs.createWriteStream('output.pdf'));  //creating a write stream 

        doc.font('Times-Roman')
        .fontSize(15)
        .text("------------------------------------------------------------------------------------------")
        .fontSize(12)
        .text('Women @ Freshdesk', {paragraphGap: 10,indent: 10,align: 'center',})
        .fontSize(15)
        .text("------------------------------------------------------------------------------------------");

        db.all_messages(function(result) {
            if(result){
                for(i=0;i<result.length;i++) {
                    user_name = result[i]['user_name'] != 'anonymous_user' ? result[i]['user_name'] : 'User '+result[i]['id']
                    doc.fontSize(13).text(user_name + " : ");
                    doc.fontSize(12).text(result[i]['message'], {paragraphGap: 2,indent: 5,align: 'justify',});
                    doc.fontSize(12).text("\n");
                }
            }       
            doc.end(); 
        });
    }
};