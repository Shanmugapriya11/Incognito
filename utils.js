    
module.exports = {
    generatingPDF: function generatingPDF(){
        doc = new PDF();                        
        doc.pipe(fs.createWriteStream('output.pdf'));  //creating a write stream 

        doc.fontSize(10)
        .text("---------------------------------------------------------------------------------")
        .fontSize(15)
        .text('Women @ Freshdesk')
        .fontSize(10)
        .text("---------------------------------------------------------------------------------");

        db.all_messages(function(result) {
            if(result){
                for(i=0;i<result.length;i++) {
                    doc.fontSize(12).text(result[i]['user_name']+ " : ");
                    doc.fontSize(10).text(result[i]['message'], {paragraphGap: 10,indent: 20,align: 'justify',});
                }
            }       
            doc.end(); 
        });
    }
};