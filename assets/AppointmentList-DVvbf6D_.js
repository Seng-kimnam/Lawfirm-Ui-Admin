import{r as p,z as l,u as $,j as e,f as G,e as U,P as Y,B as _,a as q}from"./index-DPwNui4_.js";import{C as W}from"./ComponentCard-Coa2Yw06.js";import{B as b}from"./Button-dmrfMq3j.js";import{f as J,b as K}from"./AppointmentService-CiZ9v_Yj.js";import{T as R,b as k,d as Q}from"./table-CEtPduKO.js";import{B as V}from"./index-BO7WuwF6.js";import{I as X}from"./InputField-Dqvac5eK.js";import{a as Z,c as n}from"./index-enBlcd4s.js";import{r as ee}from"./api-BfbnHw83.js";import{E as te}from"./Edit-zEhyMzEl.js";import{T as ae}from"./Trash-CpN0RwaQ.js";import"./utils-BmB2-Tcx.js";import"./clsx-BzRwHxf0.js";const re=({appointmentList:d,parseDate:g,parseTime:c})=>{const[m,u]=p.useState(""),[i,x]=p.useState(d),[j,h]=p.useState(!1),[r,v]=p.useState({status:"",meetingType:"",dateRange:"all",location:"",clientName:""});console.log("Initial appointment list in report:",i);const w=p.useMemo(()=>!!(r.status||r.meetingType||r.location.trim()||r.clientName.trim()),[r.clientName,r.location,r.meetingType,r.status]);p.useEffect(()=>{x(d)},[d]),p.useEffect(()=>{const t=setTimeout(async()=>{var s;if(!w){x(d);return}h(!0);try{const a=await J({status:r.status||void 0,meetingType:r.meetingType||void 0,location:r.location||void 0,clientName:r.clientName||void 0}),o=Array.isArray(a==null?void 0:a.payload)?a.payload:Array.isArray((s=a==null?void 0:a.payload)==null?void 0:s.content)?a.payload.content:[];x(o)}catch{l.error("Failed to filter appointments"),x(d)}finally{h(!1)}},350);return()=>clearTimeout(t)},[d,r.clientName,r.location,r.meetingType,r.status,w]);const F=t=>{const s=new Date,a=new Date;switch(t){case"today":return a.setHours(0,0,0,0),{start:a,end:s};case"week":return a.setDate(s.getDate()-7),{start:a,end:s};case"month":return a.setMonth(s.getMonth()-1),{start:a,end:s};default:return{start:new Date(2e3,0,1),end:s}}},A=$();function L(t){switch(t.toLowerCase()){case"pending":return"bg-orange-500 dark:bg-orange-600";case"finished":return"bg-green-500 dark:bg-green-600";case"confirmed":return"bg-blue-500 dark:bg-blue-600";case"cancelled":return"bg-red-500 dark:bg-red-600";default:return"bg-gray-700 dark:bg-gray-600"}}async function P(t){l(s=>e.jsxs("div",{className:"flex flex-col font-extrabold text-gray-900 dark:text-white text-lg gap-2 bg-white dark:bg-gray-900 p-4 rounded-lg",children:[e.jsxs("p",{children:["Are you sure you want to delete Task id ",t,"?"]}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx("button",{className:"px-3 py-1 text-[16px] text-gray-900 dark:text-white bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded",onClick:()=>l.dismiss(s.id),children:"Cancel"}),e.jsx("button",{className:"px-3 py-1 text-[16px] bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 rounded",onClick:async()=>{l.dismiss(s.id);const a=l.loading("Deleting task...");try{const o=await ee(`appointments/${t}`,"DELETE",void 0,void 0);l.dismiss(a),(o==null?void 0:o.status)==="ACCEPTED"?l.success(`Task ID ${t} deleted successfully`):l.error((o==null?void 0:o.detail)||"Delete failed")}catch{l.dismiss(a),l.error("Server error. Please try again.")}},children:"Confirm"})]})]}),{duration:1/0})}const H=p.useMemo(()=>i.filter(t=>{var C,T,D,S,I,E;const s=m.toLowerCase(),a=((C=t.appointmentId)==null?void 0:C.toString().includes(s))||((T=t.location)==null?void 0:T.toLowerCase().includes(s))||((D=t.purpose)==null?void 0:D.toLowerCase().includes(s))||((E=(I=(S=t.task)==null?void 0:S.lawyer)==null?void 0:I.fullName)==null?void 0:E.toLowerCase().includes(s)),o=new Date(t.appointmentDate),{start:N,end:B}=F(r.dateRange),O=o>=N&&o<=B;return a&&O}),[m,r.dateRange,i]),y=(t,s)=>{if(s==="MeetingType")switch(t){case"IN_PERSON":return"In Person";case"ONLINE":return"Online";default:return t}else switch(t){case"PENDING":return"Pending";case"CONFIRMED":return"Confirmed";case"FINISHED":return"Finished";case"CANCELLED":return"Cancelled";default:return t}},z=()=>{const t=window.open("","","height=800,width=1200"),s=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 15px; }
            .header h1 { font-size: 24px; margin-bottom: 10px; }
            .header p { font-size: 14px; color: #666; }
            .filters-info { margin-bottom: 20px; font-size: 13px; background: #f5f5f5; padding: 10px; border-radius: 4px; }
            .filters-info strong { display: block; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #004B87; color: white; padding: 12px; text-align: left; font-weight: bold; font-size: 12px; }
            td { padding: 10px 12px; border-bottom: 1px solid #ddd; font-size: 12px; }
            tr:nth-child(even) { background: #f9f9f9; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            .summary { margin-bottom: 20px; padding: 15px; background: #e8f4f8; border-left: 4px solid #004B87; }
            .summary-item { display: inline-block; margin-right: 30px; }
            .summary-item strong { display: block; color: #004B87; font-size: 16px; }
            .status-pending { background: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 3px; }
            .status-confirmed { background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 3px; }
            .status-finished { background: #d1ecf1; color: #0c5460; padding: 4px 8px; border-radius: 3px; }
            .status-cancelled { background: #f8d7da; color: #721c24; padding: 4px 8px; border-radius: 3px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Appointment Report</h1>
            <p>Generated on ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})} at ${new Date().toLocaleTimeString("en-US")}</p>
          </div>

          <div class="summary">
            <div class="summary-item">
              <strong>${i.length}</strong>
              <span>Total Appointments</span>
            </div>
            <div class="summary-item">
              <strong>${i.filter(a=>a.status==="CONFIRMED").length}</strong>
              <span>Confirmed</span>
            </div>
            <div class="summary-item">
              <strong>${i.filter(a=>a.status==="PENDING").length}</strong>
              <span>Pending</span>
            </div>
            <div class="summary-item">
              <strong>${i.filter(a=>a.status==="FINISHED").length}</strong>
              <span>Finished</span>
            </div>
            <div class="summary-item">
              <strong>${i.filter(a=>a.status==="CANCELLED").length}</strong>
              <span>Cancelled</span>
            </div>
          </div>

          ${Object.values(r).some(a=>a&&a!=="all")?`<div class="filters-info">
              <strong>Applied Filters:</strong>
              ${r.status?`Status: ${y(r.status,"AppointmentStatus")}<br>`:""}
              ${r.meetingType?`Meeting Type: ${y(r.meetingType,"MeetingType")}<br>`:""}
              ${r.location?`Location: ${r.location}<br>`:""}
              ${r.clientName?`Client Name: ${r.clientName}<br>`:""}
              
            </div>`:""}

          <table>
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Client Name</th>
                <th>Meeting Type</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              ${i.map(a=>{var o,N;return`
                <tr>
                  <td>${a.appointmentId??"N/A"}</td>
                  <td>${g(a.appointmentDate)??"N/A"}</td>
                  <td>${c(a.appointmentTime)??"N/A"}</td>
                  <td>${a.location??"N/A"}</td>
                  <td>${((N=(o=a.task)==null?void 0:o.lawyer)==null?void 0:N.fullName)??"N/A"}</td>
                  <td>${y(a.meetingType,"MeetingType")??"N/A"}</td>
                  <td>${a.purpose??"N/A"}</td>
                  <td><span class="status-${a.status.toLowerCase()}">${y(a.status,"AppointmentStatus")??"N/A"}</span></td>
                  <td>${new Date(a.createdAt??"").toLocaleDateString("en-US")}</td>
                </tr>
              `}).join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>This is an automatically generated report. For further assistance, please contact support.</p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} All Rights Reserved.</p>
          </div>
        </body>
      </html>
    `;t&&(t.document.write(s),t.document.close(),t.focus(),setTimeout(()=>{t.print(),t.close()},250))},f=(t,s)=>{v(a=>({...a,[t]:s}))},M=()=>{v({status:"",meetingType:"",dateRange:"all",location:"",clientName:""}),u(""),x(d)};return e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{className:"bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-900 dark:text-white",children:"Appointment Report"}),e.jsxs(b,{size:"md",variant:"primary",onClick:z,className:"flex items-center gap-2",children:[e.jsx(G,{className:"w-4 h-4"}),"Print Report"]})]}),e.jsx("div",{className:"mb-6",children:e.jsx(X,{type:"text",placeholder:"Search by ID, location, purpose, or client name...",icon:e.jsx(V,{className:"w-5 h-5"}),value:m,onChange:t=>u(t.target.value)})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Status"}),e.jsxs("select",{value:r.status,onChange:t=>f("status",t.target.value),className:"w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",children:[e.jsx("option",{value:"",className:"dark:bg-gray-800 dark:text-white",children:"All Status"}),e.jsx("option",{value:"PENDING",className:"dark:bg-gray-800 dark:text-white",children:"Pending"}),e.jsx("option",{value:"CONFIRMED",className:"dark:bg-gray-800 dark:text-white",children:"Confirmed"}),e.jsx("option",{value:"FINISHED",className:"dark:bg-gray-800 dark:text-white",children:"Finished"}),e.jsx("option",{value:"CANCELLED",className:"dark:bg-gray-800 dark:text-white",children:"Cancelled"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Meeting Type"}),e.jsxs("select",{value:r.meetingType,onChange:t=>f("meetingType",t.target.value),className:"w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400",children:[e.jsx("option",{value:"",className:"dark:bg-gray-800 dark:text-white",children:"All Types"}),e.jsx("option",{value:"IN_PERSON",className:"dark:bg-gray-800 dark:text-white",children:"In Person"}),e.jsx("option",{value:"ONLINE",className:"dark:bg-gray-800 dark:text-white",children:"Online"}),e.jsx("option",{value:"HYBRID",className:"dark:bg-gray-800 dark:text-white",children:"Hybrid"})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Location"}),e.jsx("input",{type:"text",placeholder:"Search by location",value:r.location,onChange:t=>f("location",t.target.value),className:"w-full px-3 py-3 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Client Name"}),e.jsx("input",{type:"text",placeholder:"Search by client name",value:r.clientName,onChange:t=>f("clientName",t.target.value),className:"w-full px-3 py-3 border border-gray-300 dark:border-white/[0.1] rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"})]})]}),e.jsx("div",{className:"mb-6",children:e.jsx(b,{size:"sm",variant:"outline",onClick:M,children:"Reset Filters"})}),e.jsxs("div",{className:"mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/30",children:[e.jsx("p",{className:"text-sm text-gray-700 dark:text-gray-300",children:e.jsxs("strong",{children:["Showing ",H.length," of"," ",w?i.length:d.length," ","appointments"]})}),j&&e.jsx("p",{className:"mt-1 text-xs text-blue-700 dark:text-blue-300",children:"Applying server-side filters..."})]}),e.jsx("div",{className:"overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]",children:e.jsx("div",{className:"max-w-full overflow-x-auto",children:e.jsxs(R,{children:[i.length>0&&e.jsx(Z,{className:"border-b border-gray-100 dark:border-white/[0.05]",children:e.jsxs(k,{children:[e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Appointment ID"}),e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Title Name"}),e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium  text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Date"}),e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Time"}),e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Location"}),e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Client Name"}),e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Meeting Type"}),e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Purpose"}),e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Status"}),e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Created At"}),e.jsx(n,{isHeader:!0,className:"px-5 py-3 font-medium text-gray-500 whitespace-nowrap dark:text-gray-400",children:"Action"})]})}),e.jsx(Q,{className:"divide-y divide-gray-100 text-center dark:divide-white/[0.05]",children:i.length>0?i.map(t=>{var s,a;return e.jsxs(k,{children:[e.jsx(n,{className:"px-5 py-4",children:t.appointmentId??"N/A"}),e.jsx(n,{className:"px-5 py-4",children:t.task.title??"N/A"}),e.jsx(n,{className:"px-4 py-3 whitespace-nowrap  text-gray-500 dark:text-white/90",children:g(t.appointmentDate)??"N/A"}),e.jsx(n,{className:"px-4 py-3 min-w-20  text-gray-500 dark:text-white/90",children:c(t.appointmentTime)??"N/A"}),e.jsx(n,{className:"px-4 py-3 whitespace-nowrap  text-gray-500 dark:text-white/90",children:t.location??"N/A"}),e.jsx(n,{className:"px-4 py-3 text-gray-500 dark:text-white/90",children:((a=(s=t.task)==null?void 0:s.lawyer)==null?void 0:a.fullName)??"N/A"}),e.jsx(n,{className:"px-5 py-4",children:y(t.meetingType,"MeetingType")??"N/A"}),e.jsx(n,{className:"px-5 py-4",children:t.purpose??"N/A"}),e.jsx(n,{className:"px-5 py-4",children:e.jsx("span",{className:`px-3 py-1 rounded-full ${L(t.status)} text-sm font-medium  text-gray-800 dark:text-gray-200`,children:y(t.status,"AppointmentStatus")??"N/A"})}),e.jsx(n,{className:"px-5 py-4 whitespace-nowrap",children:new Date(t.createdAt??"").toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}),e.jsx(n,{className:"px-5 py-4 sm:px-6 ",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{onClick:()=>A(`/edit-appointment/${t.appointmentId}`),className:"p-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600",children:e.jsx(te,{size:"24",color:"#ffffff"})}),e.jsx("button",{onClick:()=>P(t==null?void 0:t.appointmentId),className:"p-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600",children:e.jsx(ae,{size:"24",color:"#ffffff"})}),e.jsx("button",{onClick:()=>A(`/appointment-detail/${t.appointmentId}`),className:"p-2 text-sm rounded-md bg-green-700 text-white hover:bg-green-500",children:e.jsx(U,{size:"24",color:"#ffffff"})})]})})]},t.appointmentId)}):e.jsx(k,{children:e.jsx(n,{colSpan:9,className:"py-20 text-center",children:e.jsx("p",{className:"text-lg text-gray-500 dark:text-gray-400",children:"No appointments match your filters"})})})})]})})})]})})},ye=()=>{const d=$(),{appointmentList:g,page:c,totalPage:m,setPage:u,parseDate:i,parseTime:x}=K();return e.jsxs("div",{children:[e.jsx(Y,{title:"Appointment List",description:"This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"}),e.jsx("div",{className:"space-y-6",children:e.jsx(W,{title:"List Of appointments",desc:"A list of all appointments available in the system.",headerActions:e.jsx(e.Fragment,{children:e.jsx(b,{size:"md",variant:"primary",onClick:()=>d("/add-appointment"),children:"Create Appointment"})}),footer:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("span",{children:["Showing page ",c," of ",m]}),e.jsxs("span",{children:["Total Appointment : ",g==null?void 0:g.length," "]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(b,{disabled:c===1,onClick:()=>u(c-1),children:e.jsx(_,{className:" font-bold"})}),e.jsx("div",{className:"flex items-center gap-1 flex-wrap",children:Array.from({length:m},(j,h)=>e.jsx(b,{variant:h+1===c?"primary":"outline",size:"sm",onClick:()=>u(h+1),children:h+1},h+1))}),e.jsx(b,{disabled:c===m,onClick:()=>u(c+1),children:e.jsx(q,{className:" font-bold"})})]})]}),children:e.jsx("div",{className:"overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]",children:e.jsx("div",{className:"max-w-[1130px] overflow-x-auto",children:e.jsx(R,{children:e.jsx(re,{appointmentList:g,parseDate:i,parseTime:x})})})})})})]})};export{ye as default};
