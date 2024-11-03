export default function HowItWork({ locale }) {
  return (
    <section className="relative py-10 md:py-20">
      <div id="how-it-works" className="flex flex-col items-center">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-base-content from-50% to-[#9c9c9c] bg-clip-text text-transparent">
            {locale.h2}
          </h2>
          <p className="text-lg md:text-xl text-base-content/80">
            {locale.h3}
          </p>
        </div>

        <div className="w-full md:w-11/12 mx-auto relative">
          {/* Timeline */}
          <div className="absolute left-[30%] top-0 bottom-0 w-1 bg-base-content/20"></div>

          <div className="space-y-16">
            <div className="step relative flex items-center">
              <div className="w-[30%] pr-8 text-right">
                <h3 className="text-2xl font-semibold mb-3">
                  {locale.step1.title}
                </h3>
                <p className="text-base text-base-content/80 mb-4">
                  {locale.step1.description}
                </p>
              </div>
              <div className="absolute left-[30%] w-4 h-4 bg-base-content rounded-full transform -translate-x-1/2"></div>
              <div className="w-[70%] pl-8">
                <img
                  src="/rename.png"
                  alt="Registration and login illustration"
                  className="w-full rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div className="step relative flex items-center">
              <div className="w-[30%] pr-8 text-right">
                <h3 className="text-2xl font-semibold mb-3">
                  {locale.step2.title}
                </h3>
                <p className="text-base text-base-content/80 mb-4">
                  {locale.step2.description}
                </p>
              </div>
              <div className="absolute left-[30%] w-4 h-4 bg-base-content rounded-full transform -translate-x-1/2"></div>
              <div className="w-[70%] pl-8">
                <img
                  src="/step2.png"
                  alt="Installation illustration"
                  className="w-full rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            <div className="step relative flex items-center">
              <div className="w-[30%] pr-8 text-right">
                <h3 className="text-2xl font-semibold mb-3">
                  {locale.step3.title}
                </h3>
                <p className="text-base text-base-content/80 mb-4">
                  {locale.step3.description}
                </p>
              </div>
              <div className="absolute left-[30%] w-4 h-4 bg-base-content rounded-full transform -translate-x-1/2"></div>
              <div className="w-[70%] pl-8">
                <img
                  src="/step3.png"
                  alt="Creating PR illustration"
                  className="w-full rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute right-[20%] bottom-[10%] z-0">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,255,182,.15),rgba(255,255,255,0))]"></div>
      </div>
    </section>
  );
}
