export const MessageLoading = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        <span className="text-muted-foreground text-sm">로딩 중...</span>
      </div>
    </div>
  )
}
