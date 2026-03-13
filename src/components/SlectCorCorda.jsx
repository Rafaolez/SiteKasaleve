import { useState } from "react";
import "../css/SlectCorCorda.css";

export default function SelectCor() {

const [aberto,setAberto] = useState(false);
const [cor,setCor] = useState(null);

const cores = [
{
nome:"Areia",
img:"https://cdn.sanity.io/images/599r6htc/regionalized/d046c882de01b4e6da6979d5b956fbaabc6ce8bd-720x405.png?w=1200&q=70&fit=max&auto=format"
},
{
nome:"Grafite",
img:"https://cdn.sanity.io/images/599r6htc/regionalized/321c9ca2b776dd09800c0efc4ce2f678f509ada5-720x405.png?w=1200&q=70&fit=max&auto=format"
},
{
nome:"Caramelo",
img:"https://cdn.sanity.io/images/599r6htc/regionalized/2d0018315ea261aee25001a1b2a925728c8c212c-720x405.png?w=1200&q=70&fit=max&auto=format"
}
]

return (

<div className="selectCor">

<div
className="selectHeader"
onClick={()=>setAberto(!aberto)}
>

{cor ? (
<>
<img src={cor.img} width="200"/>
{cor.nome}
</>
):"Selecionar cor da Corda Nautica"}

</div>

{aberto && (

<div className="selectLista">

{cores.map((item,index)=>(
<div
key={index}
className="selectItem"
onClick={()=>{
setCor(item)
setAberto(false)
}}
>

<img src={item.img} width="120"/>
<span>{item.nome}</span>

</div>
))}

</div>

)}

</div>

)
}