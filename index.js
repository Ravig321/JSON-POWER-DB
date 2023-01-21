var roll_number = document.getElementById("roll_number");
var fname = document.getElementById("fname");
var cls = document.getElementById("cls");
var dob = document.getElementById("dob");
var enroll = document.getElementById("enroll");
var address = document.getElementById("address");
var savebtn = document.getElementById("savebtn");
var updatebtn = document.getElementById("updatebtn");
var resetbtn = document.getElementById("resetbtn");

const  connToken = "90932389|-31949271268614312|90953782";
const  DB_NAME = "SCHOOL-DB";
const DB_RELATION = "STUDENT-TABLE";
const JPDB_IML = "/api/iml";
const JPDB_IRL = "/api/irl";
const JPDB_BASE_URL = "http://api.login2explore.com:5577";

function validateData() {
  if (roll_number.value === "") {
    alert("Please fill your Roll Number");
    roll_number.focus();
    return "";
  }

  if (fname.value === "") {
    alert("Please fill your Full name");
    fname.focus();
    return "";
  }

  if (cls.value === "") {
    alert("Please fill your class");
    cls.focus();
    return "";
  }

  if (dob.value === "") {
    alert("Please fill your Date Of Birth");
    dob.focus();
    return "";
  }

  if (enroll.value === "") {
    alert("Please fill your enrollment number");
    enroll.focus();
    return "";
  }

  if (address.value === "") {
    alert("Please fill your address");
    address.focus();
    return "";
  }

  var JsonData = {
    "Roll_number": roll_number.value,
    "Full_name": fname.value,
    "Class": cls.value,
    "Dob": dob.value,
    "Enroll": enroll.value,
    "Address": address.value,
  };
  resetForm();
  return JSON.stringify(JsonData);

}

function resetForm() {
  roll_number.value = "";
  fname.value = "";
  cls.value = "";
  dob.value = "";
  enroll.value = "";
  address.value = "";
  roll_number.disabled = false;
  savebtn.disabled = true;
  updatebtn.disabled = true;
  resetbtn.disabled = true;
  roll_number.focus();
}

function saveData() {
  var JsonData = validateData();
  if (JsonData === "") {
    return "";
  }

  var putRequest = createPUTRequest(connToken, JsonData, DB_NAME, DB_RELATION);
  jQuery.ajaxSetup({ async: false });
  var jsonResponse = executeCommandAtGivenBaseUrl(
    putRequest,
    JPDB_BASE_URL,
    JPDB_IML
  );
  jQuery.ajaxSetup({ async: true });
  resetForm();
  roll_number.focus();
}

function changeData() {
  updatebtn.disabled = true;
  var JsonUpdated = validateData();
  var updateRequest = createUPDATERecordRequest(
    connToken,
    JsonUpdated,
    DB_NAME,
    DB_RELATION,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  var JsonUpdate = executeCommandAtGivenBaseUrl(
    updateRequest,
    JPDB_BASE_URL,
    JPDB_IML
  );
  jQuery.ajaxSetup({ async: true });
  resetForm();
  roll_number.focus();
}

function getRollNumber() {
  var roll_num = roll_number.value;
  var json = {
    "Roll_number": roll_num,
  };
  return JSON.stringify(json);
}

function save2file(jsonResponse) {
  var responseData = JSON.parse(jsonResponse.data);
  localStorage.setItem("recno", responseData.rec_no);
}

function fillData(JsonObj) {
  save2file(JsonObj);

  var data = JSON.parse(JsonObj.data).record;
  fname.value = data.Full_name;
  cls.value = data.Class;
  dob.value = data.Dob;
  enroll.value = data.Enroll;
  address.value = data.Address;


}

function getStudent() {
  var Roll_number_Json = getRollNumber();
  var getRequest = createGET_BY_KEYRequest(
    connToken,
    DB_NAME,
    DB_RELATION,
    Roll_number_Json
  );
  jQuery.ajaxSetup({ async: false });
  var response = executeCommandAtGivenBaseUrl(
    getRequest,
    JPDB_BASE_URL,
    JPDB_IRL
  );

     jQuery.ajaxSetup({ async: true });
  if (response.status === 400) {
    savebtn.disabled = false;
    resetbtn.disabled = false;
    roll_number.focus();
  } else if (response.status === 200) {
    roll_number.disabled = true;

    fillData(response);

    updatebtn.disabled = false;
    resetbtn.disabled = false;
    fname.focus();
  }
}






//    Common used functions

function executeCommandAtGivenBaseUrl(reqString, dbBaseUrl, apiEndPointUrl) {
  var url = dbBaseUrl + apiEndPointUrl;
  var jsonObj;
  jQuery.post(url, reqString, function (result) {
      jsonObj = JSON.parse(result);
  }).fail(function (result) {
      var dataJsonObj = result.responseText;
      jsonObj = JSON.parse(dataJsonObj);
  });
  return jsonObj;
}




function createGET_BY_KEYRequest(token, dbname, relationName, jsonObjStr, createTime, updateTime) {
  if (createTime !== undefined) {
      if (createTime !== true) {
          createTime = false;
      }
  } else {
      createTime = false;
  }
  if (updateTime !== undefined) {
      if (updateTime !== true) {
          updateTime = false;
      }
  } else {
      updateTime = false;
  }
  var value1 = "{\n"
          + "\"token\" : \""
          + token
          + "\",\n" + "\"cmd\" : \"GET_BY_KEY\",\n"
          + "\"dbName\": \""
          + dbname
          + "\",\n"
          + "\"rel\" : \""
          + relationName
          + "\",\n"
          + "\"jsonStr\":\n"
          + jsonObjStr
          + "\,"
          + "\"createTime\":"
          + createTime
          + "\,"
          + "\"updateTime\":"
          + updateTime
          + "\n"
          + "}";
  return value1;
}





function createPUTRequest(connToken, jsonObj, dbName, relName) {
  var putRequest = "{\n"
          + "\"token\" : \""
          + connToken
          + "\","
          + "\"dbName\": \""
          + dbName
          + "\",\n" + "\"cmd\" : \"PUT\",\n"
          + "\"rel\" : \""
          + relName + "\","
          + "\"jsonStr\": \n"
          + jsonObj
          + "\n"
          + "}";
  return putRequest;
}


function createUPDATERecordRequest(token, jsonObj, dbName, relName, recNo) {
  var req = "{\n"
          + "\"token\" : \""
          + token
          + "\","
          + "\"dbName\": \""
          + dbName
          + "\",\n" + "\"cmd\" : \"UPDATE\",\n"
          + "\"rel\" : \""
          + relName
          + "\",\n"
          + "\"jsonStr\":{ \""
          + recNo
          + "\":\n"
          + jsonObj
          + "\n"
          + "}}";
  return req;
}