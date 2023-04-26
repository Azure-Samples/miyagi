namespace GBB.Miyagi.RecommendationService.Utils;

public class MiyagiException : Exception
{
    public MiyagiException() : base()
    {
    }

    public MiyagiException(string message) : base(message)
    {
    }

    public MiyagiException(string message, Exception innerException) : base(message, innerException)
    {
    }
}