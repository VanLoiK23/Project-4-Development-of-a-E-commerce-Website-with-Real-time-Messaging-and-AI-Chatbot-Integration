from langchain_chroma import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings 
from langchain_classic.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

def create_hybrid_retriever():
    
    # 1. Tải Vector Store (Giữ nguyên)
    print("Đang tải mô hình embedding (HuggingFace)...")
    embedding_model = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2", 
        model_kwargs={'device': 'cpu'}
    )
    
    print("Đang tải Vector Store (ChromaDB)...")
    vectorstore = Chroma(
        persist_directory="../db/chroma_sql_store",
        embedding_function=embedding_model
    )

    # 2. TẠO RETRIEVER NÂNG CAO (HYBRID SEARCH) (Giữ nguyên)
    print("Đang lấy TẤT CẢ tài liệu từ ChromaDB để khởi tạo BM25...")
    all_docs = vectorstore.similarity_search("", k=1000) 
    
    if not all_docs:
        print("🔴 LỖI: Không tìm thấy tài liệu nào trong ChromaDB.")
        return None
        
    print(f"Đã lấy {len(all_docs)} tài liệu để huấn luyện BM25.")

    # Vector Retriever (Tìm kiếm ý nghĩa + Ngưỡng điểm tin cậy)
    retriever_vector = vectorstore.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={
            "k": 15,#3
            "score_threshold": 0.3
        }
    )

    # BM25 Retriever (Tìm kiếm từ khóa)
    retriever_bm25 = BM25Retriever.from_documents(all_docs, k=15) #k=3

    # Ensemble Retriever (Kết hợp)
    ensemble_retriever = EnsembleRetriever(
        retrievers=[retriever_vector, retriever_bm25],
        weights=[0.6, 0.4]
    )
    
    print("✅ Đã tạo Hybrid Retriever thành công!")
    return ensemble_retriever
