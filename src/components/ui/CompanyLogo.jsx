import React from 'react';

const companyLogos = {
  tesla: (
    <svg viewBox="0 0 24 24" className="h-10 w-auto" fill="#EF4444">
      <path d="M12.003 4.296c-1.97 0-3.839.262-5.597.747-.568.157-.962.333-1.159.508-.168.149-.247.314-.247.49 0 .285.228.536.63.702l.061.026.114-.149c.807-1.07 2.473-1.745 4.394-1.999l.236-.026v15.114h3.132V4.596l.236.026c1.921.254 3.587.93 4.394 1.999l.114.149.061-.026c.403-.166.631-.417.631-.702 0-.176-.079-.342-.247-.49-.197-.175-.591-.351-1.159-.508-1.758-.485-3.627-.747-5.597-.747zm0-4.296c-3.13 0-6.105.412-8.834 1.158-1.174.316-2.122.71-2.73 1.166C0 2.805 0 3.321 0 3.82c0 .903.623 1.614 1.834 2.061l.5.175.298-.412c1.394-1.929 4.122-3.122 7.244-3.473l.631-.07v.886l-.666.07C6.077 3.403 3.655 4.64 2.401 6.36l-.316.438.456.263C3.515 7.57 4.98 8 6.541 8c1.622 0 3.122-.447 4.131-1.026l.465-.263v1.079c-1.421.78-3.324 1.342-5.543 1.579L5.05 9.421v1.14l.544-.061c2.42-.272 4.499-1.017 5.867-2l.544-.386V24h2V8.114l.544.386c1.368.982 3.447 1.728 5.867 2l.544.061v-1.14l-.544-.052c-2.219-.237-4.122-.8-5.543-1.579v-1.079l.465.263C15.878 7.553 17.378 8 19 8c1.561 0 3.026-.43 4.008-1.053l.456-.263-.316-.438c-1.254-1.72-3.675-2.956-7.44-3.307l-.666-.07v-.886l.631.07c3.122.351 5.85 1.544 7.244 3.473l.298.412.5-.175c1.211-.447 1.834-1.158 1.834-2.061 0-.499 0-1.015-.436-1.496-.608-.456-1.556-.85-2.73-1.166C19.645.412 16.67 0 13.54 0z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 19 19" className="h-10 w-auto" fill="#FFFFFF">
      <path fillRule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clipRule="evenodd"/>
    </svg>
  )
};

export default function CompanyLogo({ company }) {
  if (company.id === 'tesla') {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-1.5 p-2">
        {companyLogos.tesla}
        <span className="text-[#EF4444] text-[10px] tracking-[0.3em] font-bold">TESLA</span>
      </div>
    );
  }
  if (company.id === 'spacex') {
    return (
      <div className="flex items-center justify-center h-full w-full relative">
        <span className="text-white font-black text-2xl tracking-[0.15em]">SPACEX</span>
      </div>
    );
  }
  if (company.id === 'xai') {
    return <div className="flex items-center justify-center h-full w-full text-white font-black text-[2.5rem] tracking-tighter">x<span className="ml-0.5">I</span></div>;
  }
  if (company.id === 'neuralink') {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-1">
        <svg viewBox="0 0 100 30" className="h-6 w-auto" fill="none" stroke="white" strokeWidth="2">
          <path d="M 20,25 L 40,5 L 80,5 L 60,25 Z" />
        </svg>
        <span className="text-white font-bold text-xs tracking-[0.1em]">NEURALINK</span>
      </div>
    );
  }
  if (company.id === 'boring-company') {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-white font-black text-sm tracking-[0.1em] leading-tight text-center">
        <span>THE</span>
        <span>BORING</span>
        <span>COMPANY</span>
      </div>
    );
  }
  if (company.id === 'x') {
    return <div className="flex items-center justify-center h-full w-full p-3">{companyLogos.x}</div>;
  }
  return <div className="flex items-center justify-center h-full w-full text-white font-bold text-2xl">{company.logo}</div>;
}
