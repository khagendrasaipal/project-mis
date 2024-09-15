import { RecordSet } from "./RecordSet";
declare var cn:any;

export class TaxCalculate {

   isExclusiveRange(mainid: string): boolean {
    const rs = new RecordSet();
    const sql = "select count(startunit) as rowcount from revratesetupdetail where masterid='" + mainid + "' and startunit=1";

    rs.open(sql, cn);
    let ret = true;
    if (rs.state == 1) {
      if (rs.recordCount > 0) {
        if (parseInt(rs.fields("rowcount").value) > 1)
          ret = false;
      }
      rs.close();
    }
    return ret;
  }

   dbValue(sql: string, defaultValue: any): any {
    return this.dbvalue(sql, defaultValue);
  }

   dbvalue(sql: string, defaultValue: any): any {
    let ret = defaultValue;
    // alert(sql);
    const rs = new RecordSet();
    rs.open(sql, cn);
    if (rs.state == 1) {
      if (rs.recordCount > 0) {
        ret = rs.fields(0).value;
      }
      rs.close();
    }
    if (ret == null)
      ret = defaultValue;
    // alert(ret);
    return ret;
  }

  getTax(mid:any,inputUnit:any){
    var mainid=mid.split(":")[5];
    var ret=0;
    var rs=new RecordSet();
    rs.open("select * from revratesetupdetail where masterid='"+mainid+"' order by sn",cn);
    var fyid,adminid,revenueActivity,revenueitem;
    var minimumunit=1,minimumtax=0;
    var ratein=0,calculationmethod=0;

    var inputValue=1;

    if(rs.state==1){
      if(rs.recordCount>0){
        fyid=rs.fields("fyid").value;
        adminid=rs.fields("adminid").value;
        revenueActivity=rs.fields("revenueactivity").value;
        revenueitem=rs.fields("revenueitem").value;
        minimumunit=parseFloat(rs.fields("minimumunit").value);

        if(inputUnit=="0" || inputUnit==""){
          inputUnit="1";
          inputValue=1;
        }else{
          inputValue=parseFloat(inputUnit)/parseFloat(rs.fields("convunit").value);
        }
        //46
        if(minimumunit>inputValue){
          inputValue=minimumunit;
          inputUnit=minimumunit;
        }
        minimumtax=parseFloat(rs.fields("minimumtax").value);
        ratein=parseInt(rs.fields("ratein").value);
        //53
        calculationmethod=parseInt(rs.fields("calculationmethod").value);
        /**
           *  0: Quantity X Rate [Simple]
           *  1: Quantity X Rate [Range]
           *  2: Lump Sum
        */
        //Lump Sum Begin:62
        if(calculationmethod==2){
          if(ratein==0){//rate in Rs
            ret=inputValue*parseFloat(rs.fields("rate").value);
          }else{//In percent
            ret=(inputValue*parseFloat(rs.fields("rate").value)/100);
          }
        }//Lump Sum End 73
        else if(calculationmethod==0){//Quantity X Rate [Simple] Begin
          var interval=parseFloat(rs.fields("interval").value);
          if(interval<=0){
            interval=inputValue;
          }
          var rate=parseFloat(rs.fields("rate").value);
          var inputSlice=inputValue/interval;
          if(inputSlice<1){
            inputSlice=1;
          }
          //ret=(rate/interval)*inputValue;
          /*var inputSlice1=parseInt(inputSlice);
          if(inputSlice>parseFloat(inputSlice1)){
            inputSlice=inputSlice1+1;
          }*/
          if(ratein==0){
            //ret=inputSlice*rate;
            ret=(rate/interval)*inputValue;
          }
          else{
            //ret=inputSlice*rate/100;
            ret=(rate/(interval*100))*inputValue;
            }
        }////Quantity X Rate [Simple] End  87
        else if(calculationmethod==1){//Quantity X Rate [Range] Begin
          if(rs.recordCount==1){//Single Row Begin
            if(parseFloat(rs.fields("startunit").value)==1 && parseFloat(rs.fields("interval").value)==1 && parseFloat(rs.fields("endunit").value)==1){
              //Lump Sum
              if(ratein==0){//Rate in Rs
                ret=inputValue*parseFloat(rs.fields("rate").value);
              }else{//rate in percent
                ret=(inputValue*parseFloat(rs.fields("rate").value)/100);
              }
            }//End of Lump Sum : 98
            else{//Quantity X Rate Simple Begin
              var interval=parseFloat(rs.fields("interval").value);
              var rate=parseFloat(rs.fields("rate").value);
              if(interval<=0){
                interval=inputValue;
              }
              //if(interval==-1)
              //	interval=1;
              var inputSlice=inputValue/interval;//102
              var calculationValue=parseInt(inputSlice+"");
              if(inputSlice>calculationValue){
                calculationValue++;
              }
              if(ratein==0)
                ret=calculationValue*rate;
              else
                ret=calculationValue*interval*rate/100;
            }//Quantity X Rate Simple End: 111
          }//Single Row End: 112
          else{//Multiple Row Begin: 113
            if(this.isExclusiveRange(mainid)){//Exclusive Begin
              //Verified Upto Here
              var sql1="select min(endunit) from revratesetupdetail where masterid='"+mainid+"' and endunit>="+inputValue;
              var endunit=parseFloat(this.dbvalue(sql1,"0"));
              if(endunit==0){
                endunit=-1;
              }
              if(endunit==-1){
                sql1="select * from revratesetupdetail where masterid='"+mainid +"' and endunit<>-1 order by endunit";//sn
              }else{
                sql1="select * from revratesetupdetail where masterid='"+mainid +"' and endunit<="+endunit+" and endunit>0 order by endunit";
              }
              var drs=new RecordSet();
              drs.open(sql1,cn);
              ret=0;
              var lastvalue=0;
              if(drs.state==1){
                if(rs.recordCount>0){
                while(!drs.EOF()){
                  var m_startunit=parseFloat(drs.fields("startunit").value);
                  var m_endunit=parseFloat(drs.fields("endunit").value);
                  var m_inputValue=0;
                  if(parseFloat(inputValue+"")>parseFloat(m_endunit+""))
                    m_inputValue=m_endunit-m_startunit+1;
                  else
                    m_inputValue=parseFloat(inputValue+"")-m_startunit+1;

                  var interval=parseFloat(drs.fields("interval").value);
                  var rate=parseFloat(drs.fields("rate").value);
                  lastvalue=m_endunit;
                  if(interval<=0){
                    interval=m_inputValue;
                  }
                  //if(interval==-1)
                  //	interval=1;
                  var inputSlice=m_inputValue/interval;
                  var calculationValue=parseInt(inputSlice+"");
                  if(inputSlice>calculationValue)
                    calculationValue++;
                  if(ratein==0)
                    ret=ret+(calculationValue*rate);
                  else
                    ret=ret+(calculationValue*interval*rate/100);
                  drs.moveNext();
                }
                }
                drs.close();
              }
              if(endunit== -1){
                sql1="select * from revratesetupdetail where masterid='"+mainid +"' and endunit=-1";
                var m_inputValue=inputValue-lastvalue;
                drs.open(sql1,cn);
                if(drs.state==1){
                  if(drs.recordCount>0){
                    var interval=parseFloat(drs.fields("interval").value);
                    var rate=parseFloat(drs.fields("rate").value);
                    if(interval<=0){
                      interval=m_inputValue;
                    }
                    //if(interval==-1)
                    //	interval=1;
                    var inputSlice=m_inputValue/interval;
                    var calculationValue=parseInt(inputSlice+"");
                    if(inputSlice>calculationValue)
                      calculationValue++;
                    if(ratein==0)
                      ret=ret+(calculationValue*rate);
                    else
                      ret=ret+(calculationValue*interval*rate/100);
                  }
                  drs.close();
                }
              }
            }//Exclusive End
            else{//Inclusive Begin
              ret=0;
              var sql1="select min(endunit) from revratesetupdetail where masterid='"+mainid+"' and startunit=1 and  endunit>="+inputValue;
              var endunit=parseFloat(this.dbvalue(sql1,"0"));
              if(endunit==0)
                endunit=-1;
              if(endunit!=-1){//Normal Inclusive

                sql1="select * from revratesetupdetail where masterid='"+mainid +"' and endunit="+endunit;
                var drs=new RecordSet();
                drs.open(sql1,cn);
                if(drs.state==1){
                  if(drs.recordCount>0){
                    var interval=parseFloat(drs.fields("interval").value);
                    var rate=parseFloat(drs.fields("rate").value);
                    if(interval<=0){
                      interval=inputValue;
                    }
                    //if(interval==-1)
                    //	interval=1;
                    var inputSlice=inputValue/interval;
                    var calculationValue=parseInt(inputSlice+"");
                    if(inputSlice>calculationValue)
                      calculationValue++;
                    if(ratein==0)
                        ret=calculationValue*rate;
                    else
                      ret=calculationValue*interval*rate/100;
                  }
                  drs.close();
                }
              }//End normal inclusive
              else{//Composite Inclusive Begin
                //console.log("This is composite inclusive"+ret);
                var sql1="select max(endunit) from revratesetupdetail where masterid='"+mainid+"' and  startunit=1";
                var endunit=parseFloat(this.dbvalue(sql1,"0"));
                sql1="select * from revratesetupdetail where masterid='"+mainid +"' and endunit="+endunit;
                //console.log(sql1);
                  var drs=new RecordSet();
                  drs.open(sql1,cn);
                  if(drs.state==1){
                    if(drs.recordCount>0){
                      var interval=parseFloat(drs.fields("interval").value);
                      var rate=parseFloat(drs.fields("rate").value);
                      if(interval<=0){
                        interval=endunit;
                      }
                      //if(interval==-1)
                      //	interval=1;
                      var inputSlice=endunit/interval;//inputValue/interval;
                      var calculationValue=parseInt(inputSlice+"");
                      if(inputSlice>calculationValue)
                        calculationValue++;
                      if(ratein==0)
                          ret=calculationValue*rate;
                      else
                        ret=calculationValue*interval*rate/100;
                    }
                    drs.close();
                  }
                //console.log("Up to normal execution ret="+ret);
                //Proceed for and over each
                ////////////////:::::::::::::::::::::::BEGIN::::::::::::::///////////////
                var view1="(select masterid,fyid,adminid,revenueactivity,revenueitem,(startunit-"+endunit+") as startunit,interval,(case when endunit>0 then endunit-"+endunit+" else endunit end) as endunit,rate,sn,minimumunit,minimumtax,ratein,headingid,landorbuilding,taxaggregation,taxpayertype,frequency,applymultitime,calculationmethod,inputtype,figurein from revratesetupdetail where masterid='"+mainid+"' and startunit>1) as v1";

                inputValue=(inputValue-endunit);
                var sql1="select min(endunit) from "+view1+" where masterid='"+mainid+"' and endunit>="+inputValue;

                var endunit=parseFloat(this.dbvalue(sql1,"0"));


                if(endunit==0){
                  endunit=-1;
                }
                if(endunit==-1){
                  sql1="select * from "+view1+" where masterid='"+mainid +"' and endunit<>-1 order by endunit";//sn
                }else{
                  sql1="select * from "+view1+" where masterid='"+mainid +"' and endunit<="+endunit+" and endunit>0 order by endunit";
                }
                //console.log(sql1);
                var drs=new RecordSet();
                drs.open(sql1,cn);
                //ret=0;
                var lastvalue=0;
                if(drs.state==1){
                  if(drs.recordCount>0){
                  while(!drs.EOF()){
                    var m_startunit=parseFloat(drs.fields("startunit").value);
                    var m_endunit=parseFloat(drs.fields("endunit").value);

                    var m_inputValue=0;
                    if(endunit==-1)
                      m_inputValue=m_endunit-m_startunit+1;
                    else
                      m_inputValue=inputValue;

                    var interval=parseFloat(drs.fields("interval").value);
                    var rate=parseFloat(drs.fields("rate").value);
                    lastvalue=m_endunit;
                    if(interval<=0){
                      interval=m_inputValue;
                    }

                    //if(interval==-1)
                    //	interval=1;

                    var inputSlice=0;
                    //if(m_inputValue>m_endunit)
                     //	inputSlice=m_endunit/interval;
                    //else
                      inputSlice=m_inputValue/interval;
                    var calculationValue=parseInt(inputSlice+"");
                    if(inputSlice>calculationValue)
                      calculationValue++;
                    if(ratein==0)
                      ret=ret+(calculationValue*rate);
                    else
                      ret=ret+(calculationValue*interval*rate/100);
                    drs.moveNext();
                  }
                  }
                  drs.close();
                }
                if(endunit== -1){
                  sql1="select * from "+view1+" where masterid='"+mainid +"' and endunit=-1";
                  var m_inputValue=inputValue-lastvalue;
                  drs.open(sql1,cn);
                  if(drs.state==1){
                    if(drs.recordCount>0){
                      var interval=parseFloat(drs.fields("interval").value);
                      var rate=parseFloat(drs.fields("rate").value);
                      //if(interval==-1)
                      //	interval=1;
                      if(interval<=0){
                        interval=m_inputValue;
                      }
                      var inputSlice=m_inputValue/interval;
                      var calculationValue=parseInt(inputSlice+"");
                      if(inputSlice>calculationValue)
                        calculationValue++;
                      if(ratein==0)
                        ret=ret+(calculationValue*rate);
                      else
                        ret=ret+(calculationValue*interval*rate/100);
                    }
                    drs.close();
                  }
                }

                ////////////////:::::::::::::::::::::::BEGIN::::::::::::::///////////////
              }//End Composite Inclusive
            }//Inclusive End
          }//Multiple Row End
        }//Quantity X Rate [Range] End
      }//end of recordcount>0
      rs.close();
    }//end of rs.state
    if(minimumtax>ret)
      ret=minimumtax;
    return ret.toFixed(2);
  }

calculateFine(msource: any, mid: any,fineid:any,grosstax:any,grossdiscount:any): any {
    // Penalty
    let isopen = false;
    let sourcecombo = "";
    let sourcevalue = "";
    let sourcecollection = "";
    let taxfield = "";
    let anotherfield = ""; // Discount in case of fine and fine in case of discount

    if (msource === undefined) {
      msource = "0";
    }
    if (mid === undefined) {
      // From general
      mid = "0";
    }
    if (msource === "0") {
      sourcecombo = "penaltyreason";
      sourcevalue = "penalty";
      sourcecollection = "penaltycollection";
      taxfield = "amount";
      anotherfield = "discount";
    } else if (msource === "1") {
      // From lagati
      sourcecombo = "fhid_" + mid;
      sourcevalue = "fh_" + mid;
      sourcecollection = "fhcol_" + mid;
      taxfield = "l_" + mid;
      anotherfield = "dh_" + mid;
    } else if (msource === "2") {
      // From lagati
      sourcecombo = "lblfine_" + mid;
      sourcevalue = "fine_" + mid;
      sourcecollection = "finecol_" + mid;
      taxfield = "tax_" + mid;
      anotherfield = "discount_" + mid;
    }

    // const fineid = (document.getElementById(sourcecombo) as HTMLInputElement).value;

    // if (fineid === "" || fineid === "0") {
    //   (document.getElementById(sourcevalue) as HTMLInputElement).value = "";
    //   (document.getElementById(sourcecollection) as HTMLInputElement).value = "";
    //   (document.getElementById(sourcevalue) as HTMLInputElement).readOnly = !isopen;
    //   return;
    // }
    const formattedFineid = fineid.replace(/,/g, "','").replace(/ /g, "");
    const sql = "select fid,calculationtype,fineon,rate,isinpercent from revfineheading where fid in ('" + formattedFineid + "')";

    let pcollection = "{'0':0}";
    let totalfine = 0;
    // const grosstax = val((document.getElementById(taxfield) as HTMLInputElement).value);
    // const grossdiscount = val((document.getElementById(anotherfield) as HTMLInputElement).value);
    let fineon = 0;
    let finerate = 1;

    const rs = new RecordSet();
    rs.open(sql, cn);
    if (rs.state === 1) {
      if (rs.recordCount > 0) {
        while (!rs.EOF()) {
          if (rs.fields("calculationtype").value+"" === "0") {
            isopen = true;
            pcollection += ",{'" + rs.fields("fid").value + "':0}";
          } else {
            console.log(rs.fields("fineon").value);
            if (rs.fields("fineon").value+"" === "0")
              fineon = parseFloat(grosstax);
            else if (rs.fields("fineon").value+"" === "2")
              fineon = parseFloat(grossdiscount);
            else if (rs.fields("fineon").value+"" === "3")
              fineon = parseFloat(grosstax) - parseFloat(grossdiscount);
            else
              fineon = 1;

            finerate = parseFloat(rs.fields("rate").value);
            let cfine = 0;
            if (rs.fields("isinpercent").value+"" === "0") {
              cfine = parseFloat(rs.fields("rate").value);
            } else {
              cfine = fineon * (parseFloat(rs.fields("rate").value) / 100);
              console.log(cfine+":"+fineon);
            }
            totalfine = totalfine + cfine;
            pcollection += ",{'" + rs.fields("fid").value + "':" + cfine + "}";
          }
          rs.moveNext();
        }
      }
      rs.close();
    }
    return parseFloat(totalfine+"").toFixed(2);
    // (document.getElementById(sourcevalue) as HTMLInputElement).value = parseFloat(totalfine).toFixed(2); // totalfine;
    // (document.getElementById(sourcecollection) as HTMLInputElement).value = pcollection.replace("{'0':0},", "");
    // (document.getElementById(sourcevalue) as HTMLInputElement).readOnly = !isopen;

    // if (msource === "1") {
    //   // lagati
    //   calRow(mid);
    // } else if (msource === "2") {
    //   const finefield = document.getElementById("fine_" + mid);
    //   fineOnChange(finefield);
    // }
  }

  calculateDiscount(msource: any, mid: any,fineid:any,grosstax:any,grossdiscount:any): any {
    // console.log(fineid);
    // Penalty
    let isopen = false;
    let sourcecombo = "";
    let sourcevalue = "";
    let sourcecollection = "";
    let taxfield = "";
    let anotherfield = ""; // Discount in case of fine and fine in case of discount

    if (msource === undefined) {
      msource = "0";
    }
    if (mid === undefined) {
      // From general
      mid = "0";
    }
    if (msource === "0") {
      sourcecombo = "reason";
      sourcevalue = "discount";
      sourcecollection = "discountcollection";
      taxfield = "amount";
      anotherfield = "penalty";
    } else if (msource === "1") {
      // From lagati
      sourcecombo = "dhid_" + mid;
      sourcevalue = "dh_" + mid;
      sourcecollection = "dhcol_" + mid;
      taxfield = "l_" + mid;
      anotherfield = "fh_" + mid;
    } else if (msource === "2") {
      // From nonlagati
      sourcecombo = "lbldiscount_" + mid;
      sourcevalue = "discount_" + mid;
      sourcecollection = "discountcol_" + mid;
      taxfield = "tax_" + mid;
      anotherfield = "fine_" + mid;
    }

    // const fineid = (document.getElementById(sourcecombo) as HTMLInputElement).value;

    // if (fineid === "" || fineid === "0") {
    //   (document.getElementById(sourcevalue) as HTMLInputElement).value = "";
    //   (document.getElementById(sourcecollection) as HTMLInputElement).value = "";
    //   (document.getElementById(sourcevalue) as HTMLInputElement).readOnly = !isopen;
    //   return;
    // }
    const formattedFineid = fineid.replace(/,/g, "','").replace(/ /g, "");
    const sql = "select fid,calculationtype,fineon,rate,isinpercent from revfineheading where fid in ('" + formattedFineid + "')";

    let pcollection = "{'0':0}";
    let totalfine = 0;
    // const grosstax = val((document.getElementById(taxfield) as HTMLInputElement).value);
    // const grossdiscount = val((document.getElementById(anotherfield) as HTMLInputElement).value);
    let fineon = 0;
    let finerate = 1;

    const rs = new RecordSet();
    rs.open(sql, cn);
    if (rs.state === 1) {
      if (rs.recordCount > 0) {
        while (!rs.EOF()) {
          if (rs.fields("calculationtype").value === "0") {
            isopen = true;
            pcollection += ",{'" + rs.fields("fid").value + "':0}";
          } else {
            if (rs.fields("fineon").value === "0")
              fineon = parseFloat(grosstax);
            else if (rs.fields("fineon").value === "2")
              fineon = parseFloat(grossdiscount);
            else if (rs.fields("fineon").value === "3")
              fineon = parseFloat(grosstax) + parseFloat(grossdiscount);
            else
              fineon = 1;

            finerate = parseFloat(rs.fields("rate").value);
            let cfine = 0;
            if (rs.fields("isinpercent").value === "0") {
              cfine = parseFloat(rs.fields("rate").value);
            } else {
              cfine = fineon * (parseFloat(rs.fields("rate").value) / 100);
            }
            totalfine = totalfine + cfine;
            pcollection += ",{'" + rs.fields("fid").value + "':" + cfine + "}";
          }
          rs.moveNext();
        }
      }
      rs.close();
      return parseFloat(totalfine+"").toFixed(2);
    }
    // (document.getElementById(sourcevalue) as HTMLInputElement).value = parseFloat(totalfine).toFixed(2); // totalfine;
    // (document.getElementById(sourcecollection) as HTMLInputElement).value = pcollection.replace("{'0':0},", "");
    // (document.getElementById(sourcevalue) as HTMLInputElement).readOnly = !isopen;

    // if (msource === "1") {
    //   // lagati
    //   calRow(mid);
    // } else if (msource === "2") {
    //   const discountfield = document.getElementById("discount_" + mid);
    //   discountOnChange(discountfield);
    // }
  }

   loadFineHeading(msource:any,mid:any){
    var fid='0';var fname='';
    if(msource==undefined)
      msource="0";
    if(mid==undefined)
      mid="0";
    
    var sql="";
    var totalitem=0;
      var df="0";
    var revenueactivity="0";
    var lineitem="0";
    var sectorid="0";
    var itemid="0"
    var comboid="";
    var rs=new RecordSet();
    var refids="0";
    if(msource=="0"){//from general Headings
      revenueactivity=mid.split(":")[0];
      lineitem=mid.split(":")[3];
      sectorid=mid.split(":")[1];
      itemid=mid.split(":")[2];
      comboid="penaltyreason";
    }else if(msource=="1"){//from lagati 
      sql="select calculationid,lagatid,revenueactivity,lineitemid,revenuecategory,landorbuilding,refids from revlagati where lagatid='"+mid+"'";
      rs.open(sql,cn);
      if(rs.state==1){
        if(rs.recordCount>0){
          revenueactivity=rs.fields("revenueactivity").value;
          lineitem=rs.fields("lineitemid").value;
          sectorid="0";
          itemid="0";
          comboid="fhid_"+rs.fields("lagatid").value;
          refids=rs.fields("refids").value;
        }
        rs.close();
      }
      
    }else if(msource=="2"){
      sql="select calculationid,activityid,group_concat(refid,',')  as refids ,(select lineitemid from revenueactivity where revenueactivityid=a.activityid) as lineitemid from nonlagati as a where checked=1 and calculationid='"+mid+"' group by calculationid,activityid";
      rs.open(sql,cn);
      if(rs.state==1){
        if(rs.recordCount>0){
          revenueactivity=rs.fields("activityid").value;
          lineitem=rs.fields("lineitemid").value;
          sectorid="0";
          itemid="0";
          comboid="lblfine_"+rs.fields("calculationid").value;
          refids=rs.fields("refids").value;
        }
        rs.close();
      }
    }
    refids="'"+refids.replace(/,/g, "','")+"'";
    // if(comboid==""){
    //   // calculateFine(msource,mid);
    //   return;
    // }
    // removeall(comboid);
    
    var sql2="select distinct fid,code,fineheadingnp as fineheading,criteria from revfineheading where (lineitem='0' or lineitem='"+lineitem+"') and (revenueactivityid='0' or revenueactivityid='"+revenueactivity+"') and (revenuesector='0' or revenuesector='"+sectorid+"') and (revenueitem='0' or revenueitem='"+itemid+"') and discounttype=1 order by fineheading ";
    //alert(sql2);
    var rs2=new RecordSet();
    var isfound=false;
    
    rs2.open(sql2, cn);
    if(rs2.state==1) {
      if(rs2.recordCount>0) {
        while(!rs2.EOF() && !isfound) {
          if(rs2.fields("criteria").value==""){
             fid=rs2.fields("fid").value;
             fname=rs2.fields("fineheading").value;
             isfound=true;
          // additem(comboid, rs2.fields("code").value + " - " + rs2.fields("fineheading").value, rs2.fields("fid").value);
          df=rs2.fields("fid").value;
            totalitem++;
          }else{
             sql="";
            rs.open("select headingid,landorbuilding from revenueactivity where revenueactivityid='"+revenueactivity+"'",cn); 
            if(rs.state==1){
              if(rs.recordCount>0){
                var tname="tbl"+rs.fields("headingid").value +rs.fields("landorbuilding").value;
                if(refids=="0" || refids=="'0'"){
                  tname=tname+"blank";
                }
                //alert(tname);
                 if(msource=="0"){
                  sql="select 1 as valid where exists(select refid from " + tname+",revtrandate,revtaxpayerinfo where " + rs2.fields("criteria").value+")";
                 }else if(msource=="1"){//Lagati
                   sql="(select * from "+tname+" where refid in ("+refids+")) as tblnew,(select * from revlagati where lagatid='"+mid+"') as tbllagat";
                   sql="select 1 as valid where exists(select refid from " + sql+",revtrandate,revtaxpayerinfo where " + rs2.fields("criteria").value+")"; 
                 }else{//Non Lagati
                   sql="(select * from "+tname+" where refid in ("+refids+")) as tblnew";
                   sql="select 1 as valid where exists(select refid from " + sql+",revtrandate,revtaxpayerinfo where " + rs2.fields("criteria").value+")"; 
                 }
                //console.log(sql);
                
              }
            rs.close();	
            }
            //console.log(sql);
            if(sql!=""){
              rs.open(sql,cn);
              if(rs.state==1){
                if(rs.recordCount>0){
                  fid=rs2.fields("fid").value;
                  fname=rs2.fields("fineheading").value;
                  isfound=true;
                  // additem(comboid, rs2.fields("code").value + " - " + rs2.fields("fineheading").value, rs2.fields("fid").value);
                  df=rs2.fields("fid").value;
                  totalitem++;
                }
                rs.close()
              }
            }
          }
          rs2.moveNext();
        }
      }
      rs2.close();
    }
      // if(totalitem!=1){
      //   additem(comboid,".......","0");
      //   document.getElementById(comboid).value="0";
      // }else{
      //   document.getElementById(comboid).value=df;
        
      // }
      // calculateFine(msource,mid);
      if(fid==undefined){
        fid='0';
        fname='';
      }
      console.log(fid);
      return {"fineid":fid,"fineheading":fname};
  }
  
   loadDicountHeading(msource:any,mid:any){
    if(msource==undefined)
      msource="0";
    if(mid==undefined)
      mid="0";
    
    var sql="";
    var totalitem=0;
      var df="0";
    var revenueactivity="0";
    var lineitem="0";
    var sectorid="0";
    var itemid="0"
    var comboid="";
    var rs=new RecordSet();
    var refids="0";
    if(msource=="0"){//from general Headings
      revenueactivity=mid.split(":")[0];
      lineitem=mid.split(":")[3];
      sectorid=mid.split(":")[1];
      itemid=mid.split(":")[2];
      comboid="reason";
    }else if(msource=="1"){//from lagati 
      sql="select calculationid,lagatid,revenueactivity,lineitemid,revenuecategory,landorbuilding,refids from revlagati where lagatid='"+mid+"'";
      //alert(sql);
      rs.open(sql,cn);
      if(rs.state==1){
        if(rs.recordCount>0){
          revenueactivity=rs.fields("revenueactivity").value;
          lineitem=rs.fields("lineitemid").value;
          sectorid="0";
          itemid="0";
          comboid="dhid_"+rs.fields("lagatid").value;
          refids=rs.fields("refids").value;
        }
        rs.close();
      }
      
    }else if(msource=="2"){
      sql="select calculationid,activityid,group_concat(refid,',')  as refids ,(select lineitemid from revenueactivity where revenueactivityid=a.activityid) as lineitemid from nonlagati as a where checked=1 and calculationid='"+mid+"' group by calculationid,activityid";
      
      rs.open(sql,cn);
      if(rs.state==1){
        if(rs.recordCount>0){
          revenueactivity=rs.fields("activityid").value;
          lineitem=rs.fields("lineitemid").value;
          sectorid="0";
          itemid="0";
          comboid="lbldiscount_"+rs.fields("calculationid").value;
          refids=rs.fields("refids").value;
        }
        rs.close();
      }
    }
    refids="'"+refids.replace(/,/g, "','")+"'";
    // if(comboid==""){
    //   // calculateDiscount(msource,mid);
    //   return;
    // }
    // removeall(comboid);
    
    var sql2="select distinct fid,code,fineheadingNp as fineheading,criteria from revfineheading where (lineitem='0' or lineitem='"+lineitem+"') and (revenueactivityid='0' or revenueactivityid='"+revenueactivity+"') and (revenuesector='0' or revenuesector='"+sectorid+"') and (revenueitem='0' or revenueitem='"+itemid+"') and discounttype=2 order by fineheading ";
    //alert(sql2);
    var rs2=new RecordSet();
    var discountheading='';
    var discountid='0';
    rs2.open(sql2, cn);
    if(rs2.state==1) {
      if(rs2.recordCount>0) {
        var isfound=false;
      
        console.log(rs2.fields("criteria").value);

        while(!rs2.EOF() && !isfound) {
          console.log("begining");
      var criteria="";
      try {
        criteria=rs2.fields("criteria").value;
      } catch (error) {
        criteria="";
      }
          if(criteria==""){
         
          // additem(comboid, rs2.fields("code").value + " - " + rs2.fields("fineheading").value, rs2.fields("fid").value);
          df=rs2.fields("fid").value;
          discountid=rs2.fields("fid").value;
          discountheading=rs2.fields("fineheading").value;

          isfound=true;
            totalitem++;
          }else{
             sql="select headingid,landorbuilding from revenueactivity where revenueactivityid='"+revenueactivity+"'";
             console.log(sql);
            rs.open("select headingid,landorbuilding from revenueactivity where revenueactivityid='"+revenueactivity+"'",cn); 
            if(rs.state==1){
              if(rs.recordCount>0){
                var tname="tbl"+rs.fields("headingid").value +rs.fields("landorbuilding").value;
                console.log(tname);
                if(refids=="0" || refids=="'0'"){
                  tname=tname+"blank";
                }
                //alert(tname);
                 if(msource=="0"){
                  sql="select 1 as valid where exists(select refid from " + tname+",revtrandate,revtaxpayerinfo where " + rs2.fields("criteria").value+")";
                 }else if(msource=="1"){//Lagati
                   sql="(select * from "+tname+" where refid in ("+refids+")) as tblnew,(select * from revlagati where lagatid='"+mid+"') as tbllagat";
                   sql="select 1 as valid where exists(select refid from " + sql+",revtrandate,revtaxpayerinfo where " + rs2.fields("criteria").value+")"; 
                 }else{//Non Lagati
                   sql="(select * from "+tname+" where refid in ("+refids+")) as tblnew";
                   sql="select 1 as valid where exists(select refid from " + sql+",revtrandate,revtaxpayerinfo where " + rs2.fields("criteria").value+")"; 
                 }
                console.log(sql);
                
              }
            rs.close();	
            }
            //alert(sql);
            //console.log(sql);
            if(sql!=""){
              rs.open(sql,cn);
              if(rs.state==1){
                console.log(rs.recordCount);
                if(rs.recordCount>0){
                  discountid=rs2.fields("fid").value;
                  discountheading=rs2.fields("fineheading").value;
        
                  isfound=true;
                  // additem(comboid, rs2.fields("code").value + " - " + rs2.fields("fineheading").value, rs2.fields("fid").value);
                  df=rs2.fields("fid").value;
                  totalitem++;
                }
                // console.log(totalitem);
                rs.close()
              }
            }
          }
         
          rs2.moveNext();
          console.log(rs2.recordCount);
        }
console.log("here")
      }
      rs2.close();
    }
   
    return {'discountid':discountid,'discountheading':discountheading};
      // if(totalitem!=1){
      //   additem(comboid,".......","0");
      //   document.getElementById(comboid).value="0";
      // }else{
      //   document.getElementById(comboid).value=df;
        
      // }
      // calculateDiscount(msource,mid);
  }

}
