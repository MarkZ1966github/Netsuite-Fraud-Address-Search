function searchFraudAddress() 
{

    //get data on the record being processed (depends on the deployment)
    var rec = nlapiGetNewRecord();

    // get ship to address and addressee information
  var recAddress1 = rec.getFieldValue('shipaddr1');
  var recZip = rec.getFieldValue('shipzip');
  var recState = rec.getFieldValue('shipstate');
  var recAddressee = rec.getFieldValue('shipaddressee');

    // START get fraud address records

  var columns = [];
  var fraudAddress = nlapiSearchRecord('customrecord_fraudaddress',null,[
 
],
[
  columns[0] =  new nlobjSearchColumn("custrecord_fraud_address1",null,null).setSort(false), 
  columns[1] =  new nlobjSearchColumn("custrecord_fraud_address2",null,null), 
  columns[2] =  new nlobjSearchColumn("custrecord_fraud_city",null,null), 
  columns[3] =  new nlobjSearchColumn("custrecord_fraud_state",null,null), 
  columns[4] =  new nlobjSearchColumn("custrecord_fraud_zip",null,null), 
]
);

    // END get fraud address records

// START get fraud name

  var column = [];
  var fraudNames = nlapiSearchRecord('customrecord_fraudaddress',null,[
 
],
[
  column[0] =  new nlobjSearchColumn("custrecord_fraud_addressee",null,null), 
]
);

// END get fraud name 

    // START Compare Sales Order Address to all Fraud Addresses

  var p = 1;

  for (var i = 0; fraudAddress != null && i < fraudAddress.length; i++)
    {
      var searchresult = fraudAddress[i];
        var fraudAddress1 = ('custrecord_fraud_address1',p,searchresult.getValue(columns[0]));
        var fraudAddress2 = ('custrecord_fraud_address2',p,searchresult.getValue(columns[1]));
        var fraudCity = ('custrecord_fraud_city',p,searchresult.getValue(columns[2]));
        var fraudState = ('custrecord_fraud_state',p,searchresult.getValue(columns[3]));
        var fraudZip = ('custrecord_fraud_zip',p,searchresult.getValue(columns[4]));

        if(fraudAddress1.match(recAddress1) && fraudZip.match(recZip) && fraudState.match(recState))
            {
            rec.setFieldValue('orderstatus','A');
            rec.setFieldValue('memo','POTENTIAL FRAUD ORDER');
              if (rec.getFieldValue('source') == 'Web (YOUR WEBSITE)'){
                    rec.setFieldValue('custbody_keycode_text','POTENTIAL FRAUD ORDER');
                }
          }

      p++;
     }
     
    // END Compare Sales Order Address to all Fraud Addresses

    // START Compare Sales Order customer names to all Fraud Names

  var p = 1;

  for (var i = 0; fraudNames != null && i < fraudNames.length; i++)
    {
      var searchresult = fraudNames[i];
      var fraudAddressee = ('custrecord_fraud_addressee',p,searchresult.getValue(columns[0]));

        if(fraudAddressee.match(recAddressee))
            {
            rec.setFieldValue('orderstatus','A');
            rec.setFieldValue('memo','POTENTIAL FRAUD ORDER');
          }

      p++;
     }
     
    // END Compare Sales Order customer names to all Fraud Names
};