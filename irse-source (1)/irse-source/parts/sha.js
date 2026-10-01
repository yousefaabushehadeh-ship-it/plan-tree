/* SHA-256 (JS صرف، بيشتغل حتى على http عادي) */
function sha256(str){
  const ascii=String.fromCharCode(...new TextEncoder().encode(str));
  const rr=(v,a)=>(v>>>a)|(v<<(32-a));
  const mp=Math.pow,mw=mp(2,32);let result='',i,j;
  const words=[],bitLen=ascii.length*8;
  const K=[],H0=[],comp={};
  for(let c=2,pc=0;pc<64;c++){if(!comp[c]){for(i=0;i<313;i+=c)comp[i]=c;H0[pc]=(mp(c,.5)*mw)|0;K[pc++]=(mp(c,1/3)*mw)|0}}
  let a2=ascii+'\x80';while(a2.length%64-56)a2+='\x00';
  for(i=0;i<a2.length;i++){words[i>>2]|=a2.charCodeAt(i)<<((3-i)%4)*8}
  words[words.length]=(bitLen/mw)|0;words[words.length]=bitLen;
  let hash=H0.slice(0,8);
  for(j=0;j<words.length;){
    const w=words.slice(j,j+=16),old=hash;hash=hash.slice(0,8);
    for(i=0;i<64;i++){
      const w15=w[i-15],w2=w[i-2],a=hash[0],e=hash[4];
      const t1=hash[7]+(rr(e,6)^rr(e,11)^rr(e,25))+((e&hash[5])^((~e)&hash[6]))+K[i]+(w[i]=(i<16)?w[i]:(w[i-16]+(rr(w15,7)^rr(w15,18)^(w15>>>3))+w[i-7]+(rr(w2,17)^rr(w2,19)^(w2>>>10)))|0);
      const t2=(rr(a,2)^rr(a,13)^rr(a,22))+((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
      hash=[(t1+t2)|0].concat(hash);hash[4]=(hash[4]+t1)|0;
    }
    for(i=0;i<8;i++)hash[i]=(hash[i]+old[i])|0;
  }
  for(i=0;i<8;i++)for(j=3;j+1;j--){const b=(hash[i]>>(j*8))&255;result+=(b<16?'0':'')+b.toString(16)}
  return result;
}
