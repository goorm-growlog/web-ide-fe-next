/**
 * 메시지가 없을 때 표시되는 컴포넌트
 */
export const NoMessages = () => (
  <div className="flex flex-col items-center justify-center px-4 py-8 text-center text-muted-foreground sm:px-5 sm:py-12">
    <div className="mb-4 text-5xl" aria-hidden="true" role="img">
      💬
    </div>
    <h2 className="mb-2 font-medium text-foreground text-lg">
      Send your first message!
    </h2>
    <p className="text-sm">Send your first message!</p>
  </div>
)
