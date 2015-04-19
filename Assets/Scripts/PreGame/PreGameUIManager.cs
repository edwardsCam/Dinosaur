using UnityEngine;
using System.Collections;
using Assets.Scripts;
using Assets.Scripts.Utilities;

public class PreGameUIManager : MonoBehaviour {

    public Animator startButton;
    public Animator selectionButtons;
    public Animator worldsButtons;
	// Use this for initialization
	private void LoadLevel(string level) 
    {
        Application.LoadLevel(level);
	}

    public void StartButtonClicked()
    {
        selectionButtons.SetBool("isHidden", false);
        selectionButtons.enabled = true;
        startButton.SetBool("isHidden", true);
        
    }

    public void TRexButtonClicked()
    {
        SetDinosaurType(DinosaurType.TRex);   
    }

    public void RaptorButtonClicked()
    {
        SetDinosaurType(DinosaurType.Raptor);  
    }

    public void SpinosaurusClicked()
    {
        SetDinosaurType(DinosaurType.Spinosaurus);  
    }

    private void SetDinosaurType(DinosaurType type)
    {
        selectionButtons.SetBool("isHidden", true);
        worldsButtons.enabled = true;
        worldsButtons.SetBool("isHidden", false);
        GameObject.FindGameObjectWithTag("Settings").GetComponent<GameSettings>().currentDino = type;
    }

    public void DNMClicked()
    {
        LoadLevel("DNM");
    }

    public void MountainClicked()
    {
        LoadLevel("mountain");
    }
	
}
