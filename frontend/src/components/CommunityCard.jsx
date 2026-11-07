export default function CommunityCard({name, description, slug}) {
    return (

        <div className="shadow-sm border border-border rounded-sm h-fit cursor-pointer hover:bg-surface transition-colors duration-200">
            <div className="p-4">
                <div className="flex flex-row gap-2">
                    <div>
                        <svg
                            className="text-brand"
                            fill="currentColor"
                            height="48"
                            width="48"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M9.633 8.086c-.27 0-.536.066-.799.199a1.665 1.665 0 00-.652.596c-.173.265-.258.581-.258.948v3.961H5.999V6.321h1.876v1.074h.035c.251-.344.567-.628.948-.851a2.547 2.547 0 011.311-.335c.172 0 .335.014.488.042.153.028.267.058.342.091l-.774 1.848a.766.766 0 00-.244-.073 1.873 1.873 0 00-.349-.032l.001.001ZM19 10a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019-9 9 9 0 019 9Zm-1.8 0a7.17 7.17 0 00-1.661-4.594L11.98 13.79h-1.955l4.108-9.677A7.152 7.152 0 0010 2.8c-3.97 0-7.2 3.23-7.2 7.2s3.23 7.2 7.2 7.2 7.2-3.23 7.2-7.2Z" />
                        </svg>
                    </div>
                    <div className="flex flex-col gap-0">
                        <p className="text-md">{name}</p>
                        <span className="text-sm text-text-secondary font-light">{description.slice(0, 101) + "..."}</span>
                    </div>
                </div>
            </div>
        </div>

    )
}